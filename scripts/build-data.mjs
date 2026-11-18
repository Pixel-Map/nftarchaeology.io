import {
  mkdtemp,
  readFile,
  writeFile,
  mkdir,
  cp,
  rm,
  readdir,
  stat,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import yaml from "js-yaml";
import Ajv from "ajv";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";

function deploymentISO(value) {
  const match = value.match(
    /^([A-Za-z]{3})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})\s*(AM|PM)?\s*\+?UTC$/,
  );
  if (!match)
    throw new Error(`Unrecognized UTC deployment timestamp: ${value}`);
  const [, month, day, year, hour, minute, second, period] = match;
  const monthIndex = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].indexOf(month);
  if (monthIndex < 0) throw new Error(`Invalid month: ${value}`);
  const hours = period
    ? (Number(hour) % 12) + (period === "PM" ? 12 : 0)
    : Number(hour);
  const parsed = new Date(
    Date.UTC(
      Number(year),
      monthIndex,
      Number(day),
      hours,
      Number(minute),
      Number(second),
    ),
  );
  if (
    (period && (Number(hour) < 1 || Number(hour) > 12)) ||
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() !== monthIndex ||
    parsed.getUTCDate() !== Number(day) ||
    parsed.getUTCHours() !== hours ||
    parsed.getUTCMinutes() !== Number(minute) ||
    parsed.getUTCSeconds() !== Number(second)
  )
    throw new Error(`Invalid UTC deployment timestamp: ${value}`);
  return parsed.toISOString();
}

const isSolidityName = (name) =>
  typeof name === "string" && /^[A-Za-z_$][A-Za-z0-9_$]{0,79}$/.test(name);

function identifyContract(row, sources, sourceLeads, sourceIndex) {
  if (row.name || row.history?.finding?.title) return;
  const archived = sourceLeads.ethereumHistory[row.address];
  if (isSolidityName(archived?.etherscan_contract_name))
    return {
      name: archived.etherscan_contract_name,
      label: "Explorer name recorded by Ethereum History",
      url: archived.url,
    };
  const files = Object.values(sources);
  if (row.sourceRuntimeAgrees && files.length === 1) {
    const text = files[0]?.content || "";
    const definitions = Array.from(
      text.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "").matchAll(/\bcontract\s+([A-Za-z_$][\w$]*)\s*(?=\{|is\b)/g),
      (match) => match[1],
    );
    if (definitions.length === 1 && isSolidityName(definitions[0]))
      return { name: definitions[0], label: "Solidity contract declaration", url: row.sourceURL };
  }
  const repository = "tintinweb/smart-contract-sanctuary-ethereum";
  const index = sourceIndex[repository];
  const matches = index?.matches[row.address] || [];
  if (matches.length === 1) {
    const match = matches[0];
    const name = path.basename(match.path).match(/^[0-9a-f]{40}_(.+)\.sol$/i)?.[1];
    if (isSolidityName(name))
      return {
        name,
        label: "Name in the archived explorer source",
        url: `https://github.com/${repository}/blob/${index.reference}/${encodeURI(match.path)}`,
      };
  }
}

const root = fileURLToPath(new URL("../", import.meta.url));
const source = JSON.parse(
  await readFile(path.join(root, "historical-nfts.source.json"), "utf8"),
);
if (
  source.repository !== "https://github.com/Pixel-Map/historicalNFTs" ||
  !/^[a-f0-9]{40}$/.test(source.revision)
) {
  throw new Error(
    "The data source must specify the historicalNFTs repository and a full commit SHA.",
  );
}

// Preserve the scoring policy from historicalNFTs/src/restAPI/restAPI.service.ts.
function score(nft) {
  let value = 100;
  if (!nft.activeDevelopment) value -= 5;
  if (!nft.staticSupply) value -= 10;
  if (!nft.nonfungible) value -= 5;
  if (!nft.openseaVerification) value -= 5;
  if (nft.assetDataLocation === "On-Chain") value += 8;
  else if (nft.assetDataLocation !== "IPFS") value -= 10;
  for (const flag of nft.flags) {
    if (flag.level === "warning") value -= 6;
    if (flag.level === "alert") value -= 25;
  }
  return value;
}

function grade(value) {
  for (const [minimum, letter] of [
    [97, "A+"],
    [93, "A"],
    [90, "A-"],
    [87, "B+"],
    [83, "B"],
    [80, "B-"],
    [77, "C+"],
    [73, "C"],
    [70, "C-"],
    [67, "D+"],
    [65, "D"],
  ]) {
    if (value >= minimum) return letter;
  }
  return "F";
}

const scratch = await mkdtemp(path.join(tmpdir(), "nftarchaeology-data-"));
try {
  const response = await fetch(
    `https://codeload.github.com/Pixel-Map/historicalNFTs/tar.gz/${source.revision}`,
    {
      signal: AbortSignal.timeout(60000),
    },
  );
  if (!response.ok)
    throw new Error(`Data download failed: HTTP ${response.status}`);
  const archive = path.join(scratch, "source.tar.gz");
  await writeFile(archive, Buffer.from(await response.arrayBuffer()));
  execFileSync("tar", ["-xzf", archive, "-C", scratch]);
  const checkout = path.join(scratch, `historicalNFTs-${source.revision}`);
  const schema = JSON.parse(
    await readFile(path.join(checkout, "nft_schema.json"), "utf8"),
  );
  // The source schema is OpenAPI; validate its NFT definition using its local refs.
  const validate = new Ajv({
    strict: false,
    allErrors: true,
    validateFormats: false,
  }).compile({
    components: schema.components,
    $ref: "#/components/schemas/NFT",
  });
  const records = [];
  const slugs = new Set();
  for (const filename of (await readdir(path.join(checkout, "nfts")))
    .filter((name) => name.endsWith(".yaml"))
    .sort()) {
    const text = await readFile(path.join(checkout, "nfts", filename), "utf8");
    const nft = yaml.load(text);
    if (!validate(nft))
      throw new Error(`${filename}: ${JSON.stringify(validate.errors)}`);
    const slug = path.basename(filename, ".yaml");
    if (!/^[a-z0-9-]+$/.test(slug) || slugs.has(slug))
      throw new Error(`Invalid or duplicate slug: ${slug}`);
    slugs.add(slug);
    if (slug !== nft.title.replace(/\s+/g, "").toLowerCase())
      throw new Error(`${filename}: existing title URL would change`);
    const year = Number(nft.creationTimestamp.substring(7, 11));
    if (!Number.isInteger(year) || year < 2000 || year > 2019)
      throw new Error(`${filename}: invalid historical year`);
    // Check logos and Markdown assets before replacing the old API origin.
    const images = [
      nft.logo,
      ...Array.from(
        text.matchAll(
          /https?:\/\/api\.nftarchaeology\.io\/(images\/[\w./-]+)/g,
        ),
        (match) => match[1],
      ),
    ];
    for (const image of images) {
      if (
        !/^images\/[\w.-]+$/.test(image) ||
        !(await stat(path.join(checkout, image))).isFile()
      ) {
        throw new Error(`${filename}: missing or unsafe image ${image}`);
      }
    }
    const normalized = JSON.parse(
      JSON.stringify(nft).replace(
        /https?:\/\/api\.nftarchaeology\.io\//g,
        "/data/",
      ),
    );
    const legacyScore = nft.staticSupply == null ? null : score(nft);
    records.push({
      ...normalized,
      slug,
      logo: `/data/${nft.logo}`,
      year,
      deployedAt: deploymentISO(nft.creationTimestamp.trim()),
      score: legacyScore,
      grade: legacyScore == null ? null : grade(legacyScore),
    });
  }
  if (!records.length)
    throw new Error("The collection catalogue must not be empty.");
  const researchPath = path.join(checkout, "research/etherr");
  const researchSource = JSON.parse(
    await readFile(path.join(researchPath, "source.json"), "utf8"),
  );
  const research = JSON.parse(
    await readFile(path.join(researchPath, "records.json"), "utf8"),
  );
  const researchNotes = JSON.parse(
    await readFile(path.join(researchPath, "preliminary-notes.json"), "utf8"),
  );
  const originalRows = JSON.parse(
    await readFile(path.join(researchPath, "source-records.json"), "utf8"),
  );
  if (
    research.length !== researchSource.count ||
    originalRows.length !== research.length ||
    new Set(research.map((row) => row.address.toLowerCase())).size !==
      research.length
  )
    throw new Error("Research snapshot coverage or uniqueness mismatch.");
  const historyPath = path.join(researchPath, "history");
  const [history, findings, balances, fundedFlows, sourceIndex, sourceLeads, recompiledABIs] =
    await Promise.all(
      ["evidence", "findings", "balances", "funded-flows", "source-index", "source-leads", "recompiled-abis"]
        .map(async (name) =>
          JSON.parse(await readFile(path.join(historyPath, `${name}.json`), "utf8")),
        ),
    );
  if (
    history.chainId !== researchSource.chainId ||
    history.throughBlock !== researchSource.blockNumber ||
    balances.chainId !== researchSource.chainId ||
    fundedFlows.blockHash !== balances.blockHash
  )
    throw new Error("Research history snapshot identity mismatch.");
  const historyAddresses = new Set(research.map((row) => row.address));
  if (Object.keys(history.records).some((address) => !historyAddresses.has(address)))
    throw new Error("Unknown address in research history.");
  const familyFindings = new Map(
    findings.families.map((finding) => [finding.runtimeSha256, finding]),
  );
  const artifacts = [];
  for (const row of research) {
    if (
      !/^0x[0-9a-f]{40}$/.test(row.address) ||
      !/^\d+$/.test(row.balanceWei) ||
      row.status !== "unresolved" ||
      row.review !== "automated-triage-only"
    )
      throw new Error(`Invalid research record: ${row.address}`);
    const original = originalRows.find(
      (item) => item.address.toLowerCase() === row.address,
    );
    if (
      !original ||
      ["name", "created", "category", "kind", "year"].some(
        (key) => original[key] !== row[key],
      )
    )
      throw new Error(`Research source fields changed: ${row.address}`);
    const content = gunzipSync(
      await readFile(
        path.join(researchPath, "contracts", `${row.address}.json.gz`),
      ),
    );
    const artifact = JSON.parse(content);
    const hash = createHash("sha256")
      .update(Buffer.from(artifact.runtimeBytecode.slice(2), "hex"))
      .digest("hex");
    if (
      artifact.address !== row.address ||
      artifact.blockHash !== researchSource.blockHash ||
      artifact.blockNumber !== researchSource.blockNumber ||
      hash !== row.runtimeSha256 ||
      artifact.summary.balanceWei !== row.balanceWei
    )
      throw new Error(`Research artifact evidence mismatch: ${row.address}`);
    row.sourceFileNames = Object.keys(artifact.sourceResponse?.sources || {});
    row.abiFunctionNames = (artifact.sourceResponse?.abi || [])
      .filter((item) => item.type === "function")
      .map((item) => item.name);
    row.preliminaryNotes = researchNotes[row.address] || [];
    if (
      row.preliminaryNotes.length &&
      (!row.sourceRuntimeAgrees ||
        row.preliminaryNotes.some(
          (note) => !row.sourceFileNames.includes(note.file),
        ))
    )
      throw new Error(
        `Source-reading note lacks matching source: ${row.address}`,
      );
    const evidence = history.records[row.address];
    const historicalBalance = balances.balanceWei[row.address];
    if (evidence) {
      const creation = evidence.creation?.rows?.[0];
      if (
        evidence.snapshotBalanceWei !== row.balanceWei ||
        evidence.creation.status !== "observed" ||
        creation?.contractAddress.toLowerCase() !== row.address ||
        !/^0x[0-9a-f]{64}$/i.test(creation.txHash) ||
        !/^\d+$/.test(creation.blockNumber) ||
        Number(creation.blockNumber) > history.throughBlock
      )
        throw new Error(`Invalid deployment evidence: ${row.address}`);
      row.history = {
        deploymentBlock: Number(creation.blockNumber),
        deploymentDate: creation.timeStamp
          ? new Date(Number(creation.timeStamp) * 1000).toISOString().slice(0, 10)
          : null,
        finding: findings.addresses[row.address] || familyFindings.get(row.runtimeSha256),
        nextCheck: evidence.nextCheck,
        ...(historicalBalance !== undefined
          ? { balanceWei: historicalBalance, balanceBlock: balances.blockNumber }
          : {}),
      };
    }
    if (row.balanceWei !== "0" && !/^\d+$/.test(historicalBalance))
      throw new Error(`Missing refreshed balance: ${row.address}`);
    const archivedSources = Object.entries(sourceIndex).flatMap(([repository, index]) =>
      (index.matches[row.address] || []).map((match) => ({
        title: repository,
        url: `https://github.com/${repository}/blob/${index.reference}/${encodeURI(match.path)}`,
      })),
    );
    const relatedSources = [
      ...(sourceLeads.communitySource[row.address] || []).map((match) => ({
        title: match.label,
        url: match.source,
      })),
      ...(sourceLeads.ethereumHistory[row.address]?.url
        ? [{ title: "Ethereum History", url: sourceLeads.ethereumHistory[row.address].url }]
        : []),
      ...archivedSources,
    ];
    row.contractName = identifyContract(
      row, artifact.sourceResponse?.sources || {}, sourceLeads, sourceIndex,
    );
    const recompiledABI = recompiledABIs[row.address];
    if (recompiledABI && (
      recompiledABI.runtimeSha256 !== row.runtimeSha256 ||
      !Array.isArray(recompiledABI.abi) || !recompiledABI.abi.length
    ))
      throw new Error(`Invalid recompiled ABI: ${row.address}`);
    artifacts.push([
      row.address,
      Buffer.from(
        JSON.stringify(
          {
            ...artifact,
            sourceRevision: source.revision,
            listAttribution: researchSource.attribution,
            history: evidence,
            fundedFlows: fundedFlows.records[row.address],
            relatedSources,
            recompiledABI,
          },
          null,
          2,
        ) + "\n",
      ),
    ]);
  }
  // Only replace generated output after the entire source has passed validation.
  const publicData = path.join(root, "public/data");
  await rm(publicData, { recursive: true, force: true });
  await mkdir(publicData, { recursive: true });
  await cp(path.join(checkout, "images"), path.join(publicData, "images"), {
    recursive: true,
  });
  await writeFile(
    path.join(publicData, "source.json"),
    JSON.stringify(source, null, 2) + "\n",
  );
  await writeFile(
    path.join(publicData, "catalogue.json"),
    JSON.stringify({ source, records }, null, 2) + "\n",
  );
  await writeFile(
    path.join(publicData, "research.json"),
    JSON.stringify({ source, researchSource, records: research }, null, 2) +
      "\n",
  );
  await writeFile(
    path.join(publicData, "research-source.json"),
    JSON.stringify(researchSource, null, 2) + "\n",
  );
  await mkdir(path.join(publicData, "contracts"), { recursive: true });
  for (const [address, content] of artifacts)
    await writeFile(
      path.join(publicData, "contracts", `${address}.json`),
      content,
    );
  await mkdir(path.join(root, "src/generated"), { recursive: true });
  await writeFile(
    path.join(root, "src/generated/nfts.json"),
    JSON.stringify(records, null, 2) + "\n",
  );
  await writeFile(
    path.join(root, "src/generated/source.json"),
    JSON.stringify(source, null, 2) + "\n",
  );
  await writeFile(
    path.join(root, "src/generated/research.json"),
    JSON.stringify(research) + "\n",
  );
  await writeFile(
    path.join(root, "src/generated/research-source.json"),
    JSON.stringify(researchSource, null, 2) + "\n",
  );
  console.log(
    `Bundled ${records.length} NFTs and local images from historicalNFTs@${source.revision}.`,
  );
} finally {
  await rm(scratch, { recursive: true, force: true });
}
