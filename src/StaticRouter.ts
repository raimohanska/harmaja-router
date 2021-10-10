import * as L from "lonna";
import * as PTR from "path-to-regexp";
import {
    PathParams,
    RouteHandler,
    RouteKey,
    RouteMap,
    RouteMatch,
    RoutePath,
} from "./types";

function RouteEntry<Key extends string>(routeKey: Key) {
    const expression = routeKey === "" ? ("(.*)" as Key) : routeKey;

    const tokens = PTR.parse(expression);
    const toPath = PTR.compile(expression, { encode: encodeURIComponent });
    const match = PTR.match(expression, { decode: decodeURIComponent });
    const requiredParams = tokens.flatMap((t) =>
        typeof t === "string" ? [] : t.name
    );
    return {
        routeKey,
        toPath: (params: PathParams<any>) => {
            const paramList = Object.keys(params);
            const missing = requiredParams.filter(
                (p) => !paramList.includes(p.toString())
            );
            if (missing.length > 0)
                throw Error("Params missing: " + missing.join(", "));
            return toPath(params);
        },
        match: (path: string) => {
            const result = match(path.split("?")[0]);
            if (!result) return null;
            return result.params;
        },
    };
}
function RouteHandlerEntry<Key extends string, Result>(
    routeKey: Key,
    handler: RouteHandler<PathParams<Key>, Result>
) {
    const entry = RouteEntry(routeKey);
    return {
        ...entry,
        apply: (params: object) => (handler as any)(params),
    };
}

export function toPath<PathKey extends string>(
    routeKey: PathKey,
    params: PathParams<PathKey>
) {
    return RouteEntry(routeKey).toPath(params);
}

export type StaticRouter<R> = {
    routeByParams<PathKey extends RouteKey<R>>(
        routeKey: PathKey,
        params: PathParams<PathKey>
    ): RouteMatch<R> | null;
    routeByParams<PathKey extends RouteKey<R>>(
        routeKey: {} extends PathParams<PathKey> ? PathKey : never
    ): RouteMatch<R> | null;
    routeByPath: (path: string) => RouteMatch<R> | null;
    routeKeys: string[];
};

export function StaticRouter<R>(routes: RouteMap<R>): StaticRouter<R> {
    const routeEntries = Object.fromEntries(
        Object.entries(routes).map(([routeKey, handler]) => {
            const entry = RouteHandlerEntry(routeKey, handler as any);
            return [routeKey, entry];
        })
    );

    function routeByParams<PathKey extends RouteKey<R>>(
        routeKey: PathKey,
        params: PathParams<PathKey>
    ): RouteMatch<R> | null;
    function routeByParams<PathKey extends RouteKey<R>>(
        routeKey: {} extends PathParams<PathKey> ? PathKey : never
    ): RouteMatch<R> | null;
    function routeByParams<PathKey extends RouteKey<R>>(
        routeKey: PathKey,
        params: PathParams<PathKey> = {} as PathParams<PathKey>
    ): RouteMatch<R> | null {
        const route = routeEntries[routeKey];
        if (!route) return null;
        const result = route.apply(params);
        const path = route.toPath(params) as RoutePath<R>;
        return {
            routeKey,
            path,
            result,
        };
    }

    function routeByPath(path: string): RouteMatch<R> | null {
        for (let entry of Object.values(routeEntries)) {
            const params = entry.match(path);
            if (params) {
                return {
                    routeKey: entry.routeKey as RouteKey<R>,
                    path: path as RoutePath<R>,
                    result: entry.apply(params),
                };
            }
        }
        return null;
    }

    return {
        routeByParams,
        routeByPath,
        routeKeys: Object.keys(routes),
    };
}
