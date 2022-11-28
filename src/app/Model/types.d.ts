import { SliderEvent } from "../EventManager/types";

type HandleType = "from" | "to";

interface Update {
  events: Array<SliderEvent>;
  handles: Array<HandleType>;
  scale: boolean;
}

export {
  HandleType,
  Update,
}