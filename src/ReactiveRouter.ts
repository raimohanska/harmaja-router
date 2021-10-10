import {
    PathParams,
    RouteKey,
    RouteMap,
    RouteMatch,
    RoutePath,
    RouteResult,
} from "./types";
import * as L from "lonna";
import { StaticRouter } from "./StaticRouter";

export type Navigator<R> = {
    navigateByParams<PathKey extends RouteKey<R>>(
        p: PathKey,
        params: PathParams<PathKey>
    ): void;
    navigateByParams<PathKey extends RouteKey<R>>(
        p: {} extends PathParams<PathKey> ? PathKey : never
    ): void;
    navigateByPath: <Path extends RoutePath<R>>(path: Path) => void;
};

export type ReactiveRouter<R> = Navigator<R> & {
    navigateByParams<PathKey extends RouteKey<R>>(
        p: PathKey,
        params: PathParams<PathKey>
    ): void;
    navigateByParams<PathKey extends RouteKey<R>>(
        p: {} extends PathParams<PathKey> ? PathKey : never
    ): void;
    navigateByPath: <Path extends RoutePath<R>>(path: Path) => void;
    result: L.Property<RouteResult<R>>;
};

type RouteRequest<R> = RouteMatch<R> & {
    kind: "init" | "push" | "pop";
};

const pathFromBrowser =
    <R>(staticRouter: StaticRouter<R>, kind: "init" | "pop") =>
    (): RouteRequest<R> => {
        const path = document.location.pathname as RoutePath<R>;
        const result = staticRouter.routeByPath(path);
        if (!result)
            throw Error(
                `Non-matching path ${path}. Known routes are ${staticRouter.routeKeys}`
            );

        return { ...result, kind };
    };

export function ReactiveRouter<R>(
    routes: RouteMap<R>,
    scope: L.Scope
): ReactiveRouter<R> {
    const staticRouter = StaticRouter(routes);
    const navigationRequests = L.bus<RouteRequest<R>>();
    const pathFromPopstate = L.fromEvent(window, "popstate").pipe(
        L.map(pathFromBrowser(staticRouter, "pop"))
    );
    const routeRequests = L.merge(navigationRequests, pathFromPopstate);
    const route = routeRequests.pipe(
        L.toProperty(pathFromBrowser(staticRouter, "init")(), scope)
    );

    function navigateByParams<PathKey extends RouteKey<R>>(
        p: PathKey,
        params: PathParams<PathKey>
    ): void;
    function navigateByParams<PathKey extends RouteKey<R>>(
        p: {} extends PathParams<PathKey> ? PathKey : never
    ): void;
    function navigateByParams<PathKey extends RouteKey<R>>(
        p: PathKey,
        params?: PathParams<PathKey>
    ): void {
        const result = staticRouter.routeByParams(
            p,
            params ?? ({} as PathParams<PathKey>)
        );
        if (!result)
            throw Error(
                `Unknown route ${p}. Known routes are ${Object.keys(
                    staticRouter.routeKeys
                )}`
            );
        navigationRequests.push({ ...result, kind: "push" });
    }
    function navigateByPath<Path extends RoutePath<R>>(path: Path) {
        const result = staticRouter.routeByPath(path);
        if (!result)
            throw Error(
                `Non-matching path ${path}. Known routes are ${Object.keys(
                    staticRouter.routeKeys
                )}`
            );
        navigationRequests.push({ ...result, kind: "push" });
        console.log("Requested");
    }

    const result: L.Property<RouteResult<R>> = L.view(route, (r) => r.result);

    routeRequests.forEach((route) => {
        if (route.kind === "push") history.pushState({}, "", route.path);
    });

    return {
        navigateByParams,
        navigateByPath,
        result,
    };
}
