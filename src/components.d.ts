/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ActionActivationStrategy, ActionEvent, CookieConsent, DataProviderRegistration } from ".";
import { HistoryType, VisitStrategy } from "./services";
export namespace Components {
    interface XAction {
        /**
          * The command to execute.
         */
        "command": string;
        /**
          * The JSON serializable data payload the command requires.
         */
        "data": string;
        /**
          * Get the underlying actionEvent instance. Used by the x-action-activator element.
         */
        "getAction": () => Promise<ActionEvent<any>>;
        /**
          * This is the topic this action-command is targeting.
         */
        "topic": 'data'|'routing'|'document';
    }
    interface XActionActivator {
        /**
          * The activation strategy to use for the contained actions.
         */
        "activate": ActionActivationStrategy;
        "activateActions": () => Promise<void>;
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug": boolean;
        /**
          * The element to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelector function to find the element.  For use with activate="OnElementEvent" Only!
         */
        "targetElement"?: string;
        /**
          * This is the name of the event to listen to on the target element.
         */
        "targetEvent": string;
        /**
          * The time, in seconds at which the contained actions should be submitted.  For use with activate="AtTime" Only!
         */
        "time"?: number;
    }
    interface XAudioControl {
    }
    interface XAudioPlayer {
    }
    interface XDataDisplay {
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender": boolean;
        /**
          * The data expression to obtain a value for rendering as inner-text for this element.
          * @example {session:user.name}
          * @default null
         */
        "text"?: string;
    }
    interface XDataProviderCookie {
        /**
          * An expression that tells this component how to determine if the user has previously consented.
          * @example {storage:consented}
         */
        "hideWhen": string;
        /**
          * When skipConsent is true, the accept-cookies banner will not be displayed before accessing cookie-data.
         */
        "skipConsent": boolean;
    }
    interface XDataRepeat {
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug": boolean;
        /**
          * The array-string or data expression to obtain a collection for rendering the template.
          * @example {session:cartItems}
         */
        "items"?: string;
        /**
          * The URL to remote JSON collection to use for the items.
          * @example {session:user.name}
         */
        "itemsSrc"?: string;
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender": boolean;
    }
    interface XInclude {
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender": boolean;
        /**
          * Remote Template URL
          * @required
         */
        "src": string;
    }
    interface XLink {
        "activeClass": string;
        "anchorClass"?: string;
        "anchorId"?: string;
        "anchorRole"?: string;
        "anchorTabIndex"?: string;
        "anchorTitle"?: string;
        "ariaHaspopup"?: string;
        "ariaLabel"?: string;
        "ariaPosinset"?: string;
        "ariaSetsize"?: number;
        "custom": string;
        "exact": boolean;
        "href": string;
        "strict": boolean;
    }
    interface XShow {
        /**
          * The data expression to obtain a predicate for conditionally rendering the inner-contents of this element.
          * @example {session:user.name}
         */
        "when": string;
    }
    interface XUi {
        /**
          * This is the application / site title. If the views or dos have titles, this is added as a suffix.
         */
        "appTitle": string;
        /**
          * Turn on debugging to get helpful messages from the routing, data and action systems.
         */
        "debug": boolean;
        /**
          * Set this to false if you don't want the UI component to take up the full page size.   *
         */
        "fullPage": boolean;
        /**
          * Browser (paths) or Hash (#) routing. To support browser history, the HTTP server must be setup for a PWA
         */
        "historyType": HistoryType;
        /**
          * This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths.
         */
        "root": string;
        /**
          * Header height or offset for scroll-top on this and all views.
         */
        "scrollTopOffset"?: number;
        /**
          * This is the start path a user should land on when they first land on this app.
         */
        "startUrl": string;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition": string;
    }
    interface XView {
        /**
          * Remote URL for this Route's content.
         */
        "contentSrc": string;
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug": boolean;
        /**
          * The title for this view. This is prefixed before the app title configured in x-ui
         */
        "pageTitle": string;
        /**
          * Header height or offset for scroll-top on this view.
         */
        "scrollTopOffset"?: number;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
        /**
          * The url for this route, including the parent's routes.
         */
        "url": string;
    }
    interface XViewDo {
        /**
          * Remote URL for this Route's content.
         */
        "contentSrc": string;
        /**
          * To debug timed elements, set this value to true.
         */
        "debug": boolean;
        /**
          * Set a duration for this view. When this value exists, the page will automatically progress when the duration in seconds has passed.
         */
        "duration"?: number;
        /**
          * The title for this view. This is prefixed before the app title configured in x-ui
         */
        "pageTitle": string;
        /**
          * Header height or offset for scroll-top on this view.
         */
        "scrollTopOffset"?: number;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
        /**
          * The url for this route, including the parent's routes.
         */
        "url": string;
        /**
          * The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL
         */
        "visit": VisitStrategy;
        /**
          * If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy
         */
        "when"?: string;
    }
}
declare global {
    interface HTMLXActionElement extends Components.XAction, HTMLStencilElement {
    }
    var HTMLXActionElement: {
        prototype: HTMLXActionElement;
        new (): HTMLXActionElement;
    };
    interface HTMLXActionActivatorElement extends Components.XActionActivator, HTMLStencilElement {
    }
    var HTMLXActionActivatorElement: {
        prototype: HTMLXActionActivatorElement;
        new (): HTMLXActionActivatorElement;
    };
    interface HTMLXAudioControlElement extends Components.XAudioControl, HTMLStencilElement {
    }
    var HTMLXAudioControlElement: {
        prototype: HTMLXAudioControlElement;
        new (): HTMLXAudioControlElement;
    };
    interface HTMLXAudioPlayerElement extends Components.XAudioPlayer, HTMLStencilElement {
    }
    var HTMLXAudioPlayerElement: {
        prototype: HTMLXAudioPlayerElement;
        new (): HTMLXAudioPlayerElement;
    };
    interface HTMLXDataDisplayElement extends Components.XDataDisplay, HTMLStencilElement {
    }
    var HTMLXDataDisplayElement: {
        prototype: HTMLXDataDisplayElement;
        new (): HTMLXDataDisplayElement;
    };
    interface HTMLXDataProviderCookieElement extends Components.XDataProviderCookie, HTMLStencilElement {
    }
    var HTMLXDataProviderCookieElement: {
        prototype: HTMLXDataProviderCookieElement;
        new (): HTMLXDataProviderCookieElement;
    };
    interface HTMLXDataRepeatElement extends Components.XDataRepeat, HTMLStencilElement {
    }
    var HTMLXDataRepeatElement: {
        prototype: HTMLXDataRepeatElement;
        new (): HTMLXDataRepeatElement;
    };
    interface HTMLXIncludeElement extends Components.XInclude, HTMLStencilElement {
    }
    var HTMLXIncludeElement: {
        prototype: HTMLXIncludeElement;
        new (): HTMLXIncludeElement;
    };
    interface HTMLXLinkElement extends Components.XLink, HTMLStencilElement {
    }
    var HTMLXLinkElement: {
        prototype: HTMLXLinkElement;
        new (): HTMLXLinkElement;
    };
    interface HTMLXShowElement extends Components.XShow, HTMLStencilElement {
    }
    var HTMLXShowElement: {
        prototype: HTMLXShowElement;
        new (): HTMLXShowElement;
    };
    interface HTMLXUiElement extends Components.XUi, HTMLStencilElement {
    }
    var HTMLXUiElement: {
        prototype: HTMLXUiElement;
        new (): HTMLXUiElement;
    };
    interface HTMLXViewElement extends Components.XView, HTMLStencilElement {
    }
    var HTMLXViewElement: {
        prototype: HTMLXViewElement;
        new (): HTMLXViewElement;
    };
    interface HTMLXViewDoElement extends Components.XViewDo, HTMLStencilElement {
    }
    var HTMLXViewDoElement: {
        prototype: HTMLXViewDoElement;
        new (): HTMLXViewDoElement;
    };
    interface HTMLElementTagNameMap {
        "x-action": HTMLXActionElement;
        "x-action-activator": HTMLXActionActivatorElement;
        "x-audio-control": HTMLXAudioControlElement;
        "x-audio-player": HTMLXAudioPlayerElement;
        "x-data-display": HTMLXDataDisplayElement;
        "x-data-provider-cookie": HTMLXDataProviderCookieElement;
        "x-data-repeat": HTMLXDataRepeatElement;
        "x-include": HTMLXIncludeElement;
        "x-link": HTMLXLinkElement;
        "x-show": HTMLXShowElement;
        "x-ui": HTMLXUiElement;
        "x-view": HTMLXViewElement;
        "x-view-do": HTMLXViewDoElement;
    }
}
declare namespace LocalJSX {
    interface XAction {
        /**
          * The command to execute.
         */
        "command"?: string;
        /**
          * The JSON serializable data payload the command requires.
         */
        "data"?: string;
        /**
          * This is the topic this action-command is targeting.
         */
        "topic"?: 'data'|'routing'|'document';
    }
    interface XActionActivator {
        /**
          * The activation strategy to use for the contained actions.
         */
        "activate": ActionActivationStrategy;
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug"?: boolean;
        /**
          * The element to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelector function to find the element.  For use with activate="OnElementEvent" Only!
         */
        "targetElement"?: string;
        /**
          * This is the name of the event to listen to on the target element.
         */
        "targetEvent"?: string;
        /**
          * The time, in seconds at which the contained actions should be submitted.  For use with activate="AtTime" Only!
         */
        "time"?: number;
    }
    interface XAudioControl {
    }
    interface XAudioPlayer {
    }
    interface XDataDisplay {
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender"?: boolean;
        /**
          * The data expression to obtain a value for rendering as inner-text for this element.
          * @example {session:user.name}
          * @default null
         */
        "text"?: string;
    }
    interface XDataProviderCookie {
        /**
          * An expression that tells this component how to determine if the user has previously consented.
          * @example {storage:consented}
         */
        "hideWhen"?: string;
        /**
          * This event is raised when the component obtains consent from the user to use cookies. The data-provider system should capture this event and register the provider for use in expressions.
         */
        "onActionEvent"?: (event: CustomEvent<ActionEvent<DataProviderRegistration>>) => void;
        /**
          * This event is raised when the consents to cookies.
         */
        "onDidConsent"?: (event: CustomEvent<CookieConsent>) => void;
        /**
          * When skipConsent is true, the accept-cookies banner will not be displayed before accessing cookie-data.
         */
        "skipConsent"?: boolean;
    }
    interface XDataRepeat {
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug"?: boolean;
        /**
          * The array-string or data expression to obtain a collection for rendering the template.
          * @example {session:cartItems}
         */
        "items"?: string;
        /**
          * The URL to remote JSON collection to use for the items.
          * @example {session:user.name}
         */
        "itemsSrc"?: string;
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender"?: boolean;
    }
    interface XInclude {
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender"?: boolean;
        /**
          * Remote Template URL
          * @required
         */
        "src"?: string;
    }
    interface XLink {
        "activeClass"?: string;
        "anchorClass"?: string;
        "anchorId"?: string;
        "anchorRole"?: string;
        "anchorTabIndex"?: string;
        "anchorTitle"?: string;
        "ariaHaspopup"?: string;
        "ariaLabel"?: string;
        "ariaPosinset"?: string;
        "ariaSetsize"?: number;
        "custom"?: string;
        "exact"?: boolean;
        "href": string;
        "strict"?: boolean;
    }
    interface XShow {
        /**
          * The data expression to obtain a predicate for conditionally rendering the inner-contents of this element.
          * @example {session:user.name}
         */
        "when": string;
    }
    interface XUi {
        /**
          * This is the application / site title. If the views or dos have titles, this is added as a suffix.
         */
        "appTitle"?: string;
        /**
          * Turn on debugging to get helpful messages from the routing, data and action systems.
         */
        "debug"?: boolean;
        /**
          * Set this to false if you don't want the UI component to take up the full page size.   *
         */
        "fullPage"?: boolean;
        /**
          * Browser (paths) or Hash (#) routing. To support browser history, the HTTP server must be setup for a PWA
         */
        "historyType"?: HistoryType;
        /**
          * This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths.
         */
        "root"?: string;
        /**
          * Header height or offset for scroll-top on this and all views.
         */
        "scrollTopOffset"?: number;
        /**
          * This is the start path a user should land on when they first land on this app.
         */
        "startUrl"?: string;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
    }
    interface XView {
        /**
          * Remote URL for this Route's content.
         */
        "contentSrc"?: string;
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug"?: boolean;
        /**
          * The title for this view. This is prefixed before the app title configured in x-ui
         */
        "pageTitle"?: string;
        /**
          * Header height or offset for scroll-top on this view.
         */
        "scrollTopOffset"?: number;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
        /**
          * The url for this route, including the parent's routes.
         */
        "url"?: string;
    }
    interface XViewDo {
        /**
          * Remote URL for this Route's content.
         */
        "contentSrc"?: string;
        /**
          * To debug timed elements, set this value to true.
         */
        "debug"?: boolean;
        /**
          * Set a duration for this view. When this value exists, the page will automatically progress when the duration in seconds has passed.
         */
        "duration"?: number;
        /**
          * The title for this view. This is prefixed before the app title configured in x-ui
         */
        "pageTitle"?: string;
        /**
          * Header height or offset for scroll-top on this view.
         */
        "scrollTopOffset"?: number;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
        /**
          * The url for this route, including the parent's routes.
         */
        "url": string;
        /**
          * The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL
         */
        "visit"?: VisitStrategy;
        /**
          * If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy
         */
        "when"?: string;
    }
    interface IntrinsicElements {
        "x-action": XAction;
        "x-action-activator": XActionActivator;
        "x-audio-control": XAudioControl;
        "x-audio-player": XAudioPlayer;
        "x-data-display": XDataDisplay;
        "x-data-provider-cookie": XDataProviderCookie;
        "x-data-repeat": XDataRepeat;
        "x-include": XInclude;
        "x-link": XLink;
        "x-show": XShow;
        "x-ui": XUi;
        "x-view": XView;
        "x-view-do": XViewDo;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "x-action": LocalJSX.XAction & JSXBase.HTMLAttributes<HTMLXActionElement>;
            "x-action-activator": LocalJSX.XActionActivator & JSXBase.HTMLAttributes<HTMLXActionActivatorElement>;
            "x-audio-control": LocalJSX.XAudioControl & JSXBase.HTMLAttributes<HTMLXAudioControlElement>;
            "x-audio-player": LocalJSX.XAudioPlayer & JSXBase.HTMLAttributes<HTMLXAudioPlayerElement>;
            "x-data-display": LocalJSX.XDataDisplay & JSXBase.HTMLAttributes<HTMLXDataDisplayElement>;
            "x-data-provider-cookie": LocalJSX.XDataProviderCookie & JSXBase.HTMLAttributes<HTMLXDataProviderCookieElement>;
            "x-data-repeat": LocalJSX.XDataRepeat & JSXBase.HTMLAttributes<HTMLXDataRepeatElement>;
            "x-include": LocalJSX.XInclude & JSXBase.HTMLAttributes<HTMLXIncludeElement>;
            "x-link": LocalJSX.XLink & JSXBase.HTMLAttributes<HTMLXLinkElement>;
            "x-show": LocalJSX.XShow & JSXBase.HTMLAttributes<HTMLXShowElement>;
            "x-ui": LocalJSX.XUi & JSXBase.HTMLAttributes<HTMLXUiElement>;
            "x-view": LocalJSX.XView & JSXBase.HTMLAttributes<HTMLXViewElement>;
            "x-view-do": LocalJSX.XViewDo & JSXBase.HTMLAttributes<HTMLXViewDoElement>;
        }
    }
}
