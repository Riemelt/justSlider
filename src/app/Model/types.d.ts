import {
  SliderEvent,
} from "../EventManager/types";
import {
  FROM,
  TO,
} from "./constants";

type HandleType = typeof FROM | typeof TO;

interface Update {
  events:  Array<SliderEvent>;
  handles: Array<HandleType>;
  scale:   boolean;
}

export {
  HandleType,
  Update,
}