"use strict";

import { loadJSON } from "./ajax.js";
import { scrollSectionWrapper } from "./scrollSections.js";

loadJSON("./../assets/data.json", console.log);
