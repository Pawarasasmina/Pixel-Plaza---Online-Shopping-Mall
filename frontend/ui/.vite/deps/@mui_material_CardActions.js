import {
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  styled_default,
  useDefaultProps
} from "./chunk-5Z7RNGY6.js";
import {
  clsx_default
} from "./chunk-LNJWJNFR.js";
import {
  require_jsx_runtime
} from "./chunk-6LX6CQ4K.js";
import {
  require_prop_types
} from "./chunk-LEEEA7JD.js";
import {
  require_react
} from "./chunk-W4EHDCLL.js";
import {
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/@mui/material/CardActions/CardActions.js
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/@mui/material/CardActions/cardActionsClasses.js
function getCardActionsUtilityClass(slot) {
  return generateUtilityClass("MuiCardActions", slot);
}
var cardActionsClasses = generateUtilityClasses("MuiCardActions", ["root", "spacing"]);
var cardActionsClasses_default = cardActionsClasses;

// node_modules/@mui/material/CardActions/CardActions.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var useUtilityClasses = (ownerState) => {
  const {
    classes,
    disableSpacing
  } = ownerState;
  const slots = {
    root: ["root", !disableSpacing && "spacing"]
  };
  return composeClasses(slots, getCardActionsUtilityClass, classes);
};
var CardActionsRoot = styled_default("div", {
  name: "MuiCardActions",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, !ownerState.disableSpacing && styles.spacing];
  }
})({
  display: "flex",
  alignItems: "center",
  padding: 8,
  variants: [{
    props: {
      disableSpacing: false
    },
    style: {
      "& > :not(style) ~ :not(style)": {
        marginLeft: 8
      }
    }
  }]
});
var CardActions = React.forwardRef(function CardActions2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiCardActions"
  });
  const {
    disableSpacing = false,
    className,
    ...other
  } = props;
  const ownerState = {
    ...props,
    disableSpacing
  };
  const classes = useUtilityClasses(ownerState);
  return (0, import_jsx_runtime.jsx)(CardActionsRoot, {
    className: clsx_default(classes.root, className),
    ownerState,
    ref,
    ...other
  });
});
true ? CardActions.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: import_prop_types.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types.default.object,
  /**
   * @ignore
   */
  className: import_prop_types.default.string,
  /**
   * If `true`, the actions do not have additional margin.
   * @default false
   */
  disableSpacing: import_prop_types.default.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object])
} : void 0;
var CardActions_default = CardActions;
export {
  cardActionsClasses_default as cardActionsClasses,
  CardActions_default as default,
  getCardActionsUtilityClass
};
//# sourceMappingURL=@mui_material_CardActions.js.map
