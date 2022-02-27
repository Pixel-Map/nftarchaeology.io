import React from "react";
import ReactTooltip from "react-tooltip";

interface Flag {
  name: string,
  level: string,
  details: string
}

interface Props {
  flags: Flag[]
}

export function FlagsComponent(props: Props) {
  let flagColor = "color-47A432" // Default to green
  let message = "No red flags" // Default to no red flags

  if (props.flags.length != 0) {
    flagColor = "color-D0C000FF" // At least one warning found
    message = ` Warning`
    for (const flag of props.flags) {
      if (flag.level == "alert") {
        flagColor = "color-DF4949"
        message = " Alert"
      }
    }
    if (props.flags.length > 1) {message += 's'}

  }
  return <>
    <a data-tip data-for='happyFace'><div className={`item count-down ${flagColor}`}><span>{props.flags.length} {message}</span></div></a>
    <ReactTooltip id='happyFace' type='error' className={"overrideMe"}>
      {props.flags.map((item, index) => (
      <span key={index}><h4>{item.name}:</h4><p>{item.details}</p></span>

        ))}
    </ReactTooltip>
  </>
}
