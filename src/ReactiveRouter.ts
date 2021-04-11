import { PathParams, RouteKey, RouteMap, RouteMatch, RoutePath, RouteResult } from "./types"
import * as L from "lonna"
import { StaticRouter } from "./StaticRouter"

export function ReactiveRouter<R>(routes: RouteMap<R>, scope: L.Scope) {
    const staticRouter = StaticRouter(routes)
    const navigationRequests = L.bus<RouteMatch<R>>()
    const pathFromPopstate = L.fromEvent(window, "popstate").pipe(L.map(pathFromBrowser))
    const routeRequests = L.merge(navigationRequests, pathFromPopstate)
    const route = routeRequests.pipe(L.toProperty(pathFromBrowser(), scope))

    function pathFromBrowser() {
        const path = document.location.pathname as RoutePath<R>
        const result = staticRouter.routeByPath(path)
        if (!result) throw Error(`Non-matching path ${path}. Known routes are ${staticRouter.routeKeys}`)

        return result
    }
    function navigateByParams<PathKey extends RouteKey<R>>(p: PathKey, params: PathParams<PathKey>): void
    function navigateByParams<PathKey extends RouteKey<R>>(p: {} extends PathParams<PathKey> ? PathKey : never): void
    function navigateByParams<PathKey extends RouteKey<R>>(p: PathKey, params?: PathParams<PathKey>): void {
        const result = staticRouter.routeByParams(p, params ?? ({} as PathParams<PathKey>))
        if (!result) throw Error(`Unknown route ${p}. Known routes are ${Object.keys(staticRouter.routeKeys)}`)
        navigationRequests.push(result)
    }
    function navigateByPath<Path extends RoutePath<R>>(path: Path) {
        const result = staticRouter.routeByPath(path)
        if (!result) throw Error(`Non-matching path ${path}. Known routes are ${Object.keys(staticRouter.routeKeys)}`)
        navigationRequests.push(result)
    }

    const result: L.Property<RouteResult<R>> = L.view(route, (r) => r.result)

    routeRequests.forEach((route) => {
        if (pathFromBrowser() === route.path) return
        history.pushState({}, "", route.path)
    })

    return {
        navigateByParams,
        navigateByPath,
        result,
    }
}
