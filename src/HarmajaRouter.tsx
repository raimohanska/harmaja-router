import { componentScope } from "harmaja";
import { ReactiveRouter, Navigator } from "./ReactiveRouter";
import { PathParams, RouteKey, RouteMap, RoutePath, RoutesOf } from "./types";
import * as H from "harmaja"

const ROUTER_CONTEXT = H.createContext<ReactiveRouter<any>>("HARMAJA_ROUTER");

export function withRouter<R>(callback: (router: ReactiveRouter<R>) => void) {
    H.onContext(ROUTER_CONTEXT, callback)
}

export function HarmajaRouter<R>(routes: RouteMap<R>) {
    const router = ReactiveRouter(routes, componentScope())
    H.setContext(ROUTER_CONTEXT, router)
    return router.result
}

export function getNavigator<Routes>(): Navigator<RoutesOf<Routes>> {
    type R = RoutesOf<Routes>
    let router: ReactiveRouter<R>
    withRouter(r => router = r)
    return {
        navigateByParams<PathKey extends RouteKey<R>>(
            p: PathKey,
            params?: PathParams<PathKey>
        ) {
            if (!router) {
                throw Error("Router cannot be used until component is mounted")
            }
            router.navigateByParams(p, params)
        },
        navigateByPath<Path extends RoutePath<R>>(path: Path) {
            if (!router) {
                throw Error("Router cannot be used until component is mounted")
            }
            router.navigateByPath(path)
        }
    }
}