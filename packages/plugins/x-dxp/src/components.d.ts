/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Namespace } from "./models/namespace";
import { Experience } from ".";
import { Comparison } from "./services/data/parser";
export namespace Components {
    interface DxpActionListener {
        /**
          * When debug is true, a reactive table of values is displayed.
         */
        "debug": boolean;
        /**
          * Customize the name used for this sample data provider.
         */
        "name": string;
    }
    interface DxpData {
        /**
          * A default value to display if the data in get is not found.
         */
        "default"?: string;
        /**
          * The JS-based expression to capture data from the above model.
          * @example experience.data.color
         */
        "get": string;
        /**
          * A pipe separated list of modifier expressions to modify the captured data. clip: length    truncate: length   date   format: expression   lowercase   uppercase   capitalize   size   encode   currency
          * @example clip:5|capitalize
         */
        "modify"?: string;
    }
    interface DxpDataProvider {
    }
    interface DxpExperience {
        /**
          * Enable Debug mode to prevent API calls. (falls back to ?debug )
          * @default false
         */
        "debug": boolean;
        /**
          * Display mode for this element.
          * @default none
         */
        "display": 'logo' | 'debug' | 'none';
        /**
          * Experience data (bypasses XAPI to retrieve it)
         */
        "experienceData": string;
        /**
          * This method waits for the experience.
         */
        "getExperience": (timeout: number) => Promise<Experience | void>;
        /**
          * Enable Debug mode to prevent API calls.
          * @default false
         */
        "loadAssets": boolean;
        /**
          * The platform environment target. (optional)
         */
        "namespace": Namespace;
        /**
          * Enable preview mode to fake data and prevent API calls. (falls back to ?preview )
          * @default false
         */
        "preview": boolean;
        /**
          * This method resets the stored session-id & experience-key, effectively resetting the current experience. Useful for testing or dynamically switching experiences in-page.
         */
        "reset": () => Promise<void>;
        /**
          * Story Key (falls back to ?storyKey )
         */
        "storyKey": string;
        /**
          * User Key (falls back to ?userKey )
         */
        "userKey": string;
        /**
          * Experience API Url (optional)
         */
        "xapiUrl": string;
    }
    interface DxpExperienceDemo {
    }
    interface DxpShow {
        /**
          * A JS-based expression to capture data from the the data model.
          * @example : experience.data.color
         */
        "if": string;
        /**
          * The optional comparison operator. If omitted, general ‘truthiness’ is used.
          * @requires to
         */
        "is": Comparison;
        /**
          * The optional value for comparison.
          * @requires is
         */
        "to": any;
    }
}
declare global {
    interface HTMLDxpActionListenerElement extends Components.DxpActionListener, HTMLStencilElement {
    }
    var HTMLDxpActionListenerElement: {
        prototype: HTMLDxpActionListenerElement;
        new (): HTMLDxpActionListenerElement;
    };
    interface HTMLDxpDataElement extends Components.DxpData, HTMLStencilElement {
    }
    var HTMLDxpDataElement: {
        prototype: HTMLDxpDataElement;
        new (): HTMLDxpDataElement;
    };
    interface HTMLDxpDataProviderElement extends Components.DxpDataProvider, HTMLStencilElement {
    }
    var HTMLDxpDataProviderElement: {
        prototype: HTMLDxpDataProviderElement;
        new (): HTMLDxpDataProviderElement;
    };
    interface HTMLDxpExperienceElement extends Components.DxpExperience, HTMLStencilElement {
    }
    var HTMLDxpExperienceElement: {
        prototype: HTMLDxpExperienceElement;
        new (): HTMLDxpExperienceElement;
    };
    interface HTMLDxpExperienceDemoElement extends Components.DxpExperienceDemo, HTMLStencilElement {
    }
    var HTMLDxpExperienceDemoElement: {
        prototype: HTMLDxpExperienceDemoElement;
        new (): HTMLDxpExperienceDemoElement;
    };
    interface HTMLDxpShowElement extends Components.DxpShow, HTMLStencilElement {
    }
    var HTMLDxpShowElement: {
        prototype: HTMLDxpShowElement;
        new (): HTMLDxpShowElement;
    };
    interface HTMLElementTagNameMap {
        "dxp-action-listener": HTMLDxpActionListenerElement;
        "dxp-data": HTMLDxpDataElement;
        "dxp-data-provider": HTMLDxpDataProviderElement;
        "dxp-experience": HTMLDxpExperienceElement;
        "dxp-experience-demo": HTMLDxpExperienceDemoElement;
        "dxp-show": HTMLDxpShowElement;
    }
}
declare namespace LocalJSX {
    interface DxpActionListener {
        /**
          * When debug is true, a reactive table of values is displayed.
         */
        "debug"?: boolean;
        /**
          * Customize the name used for this sample data provider.
         */
        "name"?: string;
    }
    interface DxpData {
        /**
          * A default value to display if the data in get is not found.
         */
        "default"?: string;
        /**
          * The JS-based expression to capture data from the above model.
          * @example experience.data.color
         */
        "get": string;
        /**
          * A pipe separated list of modifier expressions to modify the captured data. clip: length    truncate: length   date   format: expression   lowercase   uppercase   capitalize   size   encode   currency
          * @example clip:5|capitalize
         */
        "modify"?: string;
    }
    interface DxpDataProvider {
    }
    interface DxpExperience {
        /**
          * Enable Debug mode to prevent API calls. (falls back to ?debug )
          * @default false
         */
        "debug"?: boolean;
        /**
          * Display mode for this element.
          * @default none
         */
        "display"?: 'logo' | 'debug' | 'none';
        /**
          * Experience data (bypasses XAPI to retrieve it)
         */
        "experienceData"?: string;
        /**
          * Enable Debug mode to prevent API calls.
          * @default false
         */
        "loadAssets"?: boolean;
        /**
          * The platform environment target. (optional)
         */
        "namespace"?: Namespace;
        /**
          * When an experience is unable to be retrieved, this event fires with 'event.detail' = error message.
         */
        "onDxp:errored"?: (event: CustomEvent<string>) => void;
        /**
          * When an experience is retrieved, this event fires with 'event.detail' being the full experience, w/ data methods like 'setData()' and 'setComplete()'.
         */
        "onDxp:initialized"?: (event: CustomEvent<Experience>) => void;
        /**
          * This event is raised when reset() is called.
         */
        "onDxp:reset"?: (event: CustomEvent<void>) => void;
        /**
          * Enable preview mode to fake data and prevent API calls. (falls back to ?preview )
          * @default false
         */
        "preview"?: boolean;
        /**
          * Story Key (falls back to ?storyKey )
         */
        "storyKey"?: string;
        /**
          * User Key (falls back to ?userKey )
         */
        "userKey"?: string;
        /**
          * Experience API Url (optional)
         */
        "xapiUrl"?: string;
    }
    interface DxpExperienceDemo {
    }
    interface DxpShow {
        /**
          * A JS-based expression to capture data from the the data model.
          * @example : experience.data.color
         */
        "if": string;
        /**
          * The optional comparison operator. If omitted, general ‘truthiness’ is used.
          * @requires to
         */
        "is"?: Comparison;
        /**
          * The optional value for comparison.
          * @requires is
         */
        "to"?: any;
    }
    interface IntrinsicElements {
        "dxp-action-listener": DxpActionListener;
        "dxp-data": DxpData;
        "dxp-data-provider": DxpDataProvider;
        "dxp-experience": DxpExperience;
        "dxp-experience-demo": DxpExperienceDemo;
        "dxp-show": DxpShow;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "dxp-action-listener": LocalJSX.DxpActionListener & JSXBase.HTMLAttributes<HTMLDxpActionListenerElement>;
            "dxp-data": LocalJSX.DxpData & JSXBase.HTMLAttributes<HTMLDxpDataElement>;
            "dxp-data-provider": LocalJSX.DxpDataProvider & JSXBase.HTMLAttributes<HTMLDxpDataProviderElement>;
            "dxp-experience": LocalJSX.DxpExperience & JSXBase.HTMLAttributes<HTMLDxpExperienceElement>;
            "dxp-experience-demo": LocalJSX.DxpExperienceDemo & JSXBase.HTMLAttributes<HTMLDxpExperienceDemoElement>;
            "dxp-show": LocalJSX.DxpShow & JSXBase.HTMLAttributes<HTMLDxpShowElement>;
        }
    }
}
