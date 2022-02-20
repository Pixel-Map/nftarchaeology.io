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
    for (const flag of props.flags) {
      flagColor = "color-D0C000FF"
      if (props.flags.length > 1) {message = ` Warnings`}
      else {message = ` Warning`}
      if (flag.level == "alert") {
        if (props.flags.length > 1) {message = ` Alerts`}
        else {message = ` Alert`}
        flagColor = "color-DF4949"
      }
    }

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
