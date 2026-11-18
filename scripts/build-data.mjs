import { mkdtemp, readFile, writeFile, mkdir, cp, rm, readdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';
import Ajv from 'ajv';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = JSON.parse(await readFile(path.join(root, 'historical-nfts.source.json'), 'utf8'));
if (source.repository !== 'https://github.com/Pixel-Map/historicalNFTs' || !/^[a-f0-9]{40}$/.test(source.revision)) {
  throw new Error('The data source must specify the historicalNFTs repository and a full commit SHA.');
}

// Preserve the scoring policy from historicalNFTs/src/restAPI/restAPI.service.ts.
function score(nft) {
  let value = 100;
  if (!nft.activeDevelopment) value -= 5;
  if (!nft.staticSupply) value -= 10;
  if (!nft.nonfungible) value -= 5;
  if (!nft.openseaVerification) value -= 5;
  if (nft.assetDataLocation === 'On-Chain') value += 8;
  else if (nft.assetDataLocation !== 'IPFS') value -= 10;
  for (const flag of nft.flags) {
    if (flag.level === 'warning') value -= 6;
    if (flag.level === 'alert') value -= 25;
  }
  return value;
}

function grade(value) {
  for (const [minimum, letter] of [[97, 'A+'], [93, 'A'], [90, 'A-'], [87, 'B+'], [83, 'B'], [80, 'B-'], [77, 'C+'], [73, 'C'], [70, 'C-'], [67, 'D+'], [65, 'D']]) {
    if (value >= minimum) return letter;
  }
  return 'F';
}

const scratch = await mkdtemp(path.join(tmpdir(), 'nftarchaeology-data-'));
try {
  const response = await fetch(`https://codeload.github.com/Pixel-Map/historicalNFTs/tar.gz/${source.revision}`, {
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`Data download failed: HTTP ${response.status}`);
  const archive = path.join(scratch, 'source.tar.gz');
  await writeFile(archive, Buffer.from(await response.arrayBuffer()));
  execFileSync('tar', ['-xzf', archive, '-C', scratch]);
  const checkout = path.join(scratch, `historicalNFTs-${source.revision}`);
  const schema = JSON.parse(await readFile(path.join(checkout, 'nft_schema.json'), 'utf8'));
  // The source schema is OpenAPI; validate its NFT definition using its local refs.
  const validate = new Ajv({ strict: false, allErrors: true, validateFormats: false }).compile({
    components: schema.components,
    $ref: '#/components/schemas/NFT',
  });
  const records = [];
  const slugs = new Set();
  for (const filename of (await readdir(path.join(checkout, 'nfts'))).filter(name => name.endsWith('.yaml')).sort()) {
    const text = await readFile(path.join(checkout, 'nfts', filename), 'utf8');
    const nft = yaml.load(text);
    if (!validate(nft)) {
      // Preserve the published text. This source violation predates migration.
      const errors = validate.errors.filter(error => !(
        source.revision === 'c7839b3c4516a0b8b46036194e86139c5aad237c' &&
        filename === 'angelbattles.yaml' && error.instancePath === '/excerpt' && error.keyword === 'maxLength'
      ));
      if (errors.length) throw new Error(`${filename}: ${JSON.stringify(errors)}`);
      console.warn('Source exception: angelbattles.yaml excerpt exceeds 280 characters; preserved verbatim.');
    }
    const slug = path.basename(filename, '.yaml');
    if (!/^[a-z0-9-]+$/.test(slug) || slugs.has(slug)) throw new Error(`Invalid or duplicate slug: ${slug}`);
    slugs.add(slug);
    if (slug !== nft.title.replace(/\s+/g, '').toLowerCase()) throw new Error(`${filename}: existing title URL would change`);
    const year = Number(nft.creationTimestamp.substring(7, 11));
    if (!Number.isInteger(year) || year < 2000 || year > 2019) throw new Error(`${filename}: invalid historical year`);
    // Check logos and Markdown assets before replacing the old API origin.
    const images = [nft.logo, ...Array.from(text.matchAll(/https?:\/\/api\.nftarchaeology\.io\/(images\/[\w./-]+)/g), match => match[1])];
    for (const image of images) {
      if (!/^images\/[\w.-]+$/.test(image) || !(await stat(path.join(checkout, image))).isFile()) {
        throw new Error(`${filename}: missing or unsafe image ${image}`);
      }
    }
    const normalized = JSON.parse(JSON.stringify(nft).replace(/https?:\/\/api\.nftarchaeology\.io\//g, '/data/'));
    records.push({ ...normalized, slug, logo: `/data/${nft.logo}`, year, score: score(nft), grade: grade(score(nft)) });
  }
  if (records.length < 18) throw new Error('Not enough records for the three homepage carousels.');
  // Only replace generated output after the entire source has passed validation.
  const publicData = path.join(root, 'public/data');
  await rm(publicData, { recursive: true, force: true });
  await mkdir(publicData, { recursive: true });
  await cp(path.join(checkout, 'images'), path.join(publicData, 'images'), { recursive: true });
  await writeFile(path.join(publicData, 'source.json'), JSON.stringify(source, null, 2) + '\n');
  await mkdir(path.join(root, 'src/generated'), { recursive: true });
  await writeFile(path.join(root, 'src/generated/nfts.json'), JSON.stringify(records, null, 2) + '\n');
  const filters = Object.fromEntries(['Standard', 'AssetDataLocation', 'Category'].map(key => [key, schema.components.schemas[key].enum]));
  await writeFile(path.join(root, 'src/generated/filters.json'), JSON.stringify(filters, null, 2) + '\n');
  console.log(`Bundled ${records.length} NFTs and local images from historicalNFTs@${source.revision}.`);
} finally {
  await rm(scratch, { recursive: true, force: true });
}
