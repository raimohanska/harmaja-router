import { h } from "harmaja"
import { RoutePath, RoutesOf, PathParams, RouteKey } from "./types";
import { ReactiveRouter } from "./ReactiveRouter";
import { withRouter } from "./HarmajaRouter";
import { toPath } from "./StaticRouter";

type LinkProps<Routes> = JSX.DetailedHTMLProps<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> 
& ({
    href: RoutePath<RoutesOf<Routes>>
} | ParameterizedRoutes<Routes>
)

type ParameterizedRoutes<Routes> = ValueOf<{
    [PathKey in RouteKey<RoutesOf<Routes>>]: { route: PathKey } & PathParams<PathKey>
}>

type ValueOf<T> = T[keyof T];

export function Link<Routes>( props: LinkProps<Routes> ) {
    type R = RoutesOf<Routes>
    let router: ReactiveRouter<R>
    withRouter<R>(r => router = r)
    const [href, navigate] = ("href" in props) ? [
        props.href, () => router.navigateByPath(props.href as any)
    ] : [
        toPath(props.route, props), () => router.navigateByParams(props.route, props)
    ]
    const onClick = (e: JSX.MouseEvent) => {
        if (!(e.altKey || e.shiftKey || e.metaKey)) {
            navigate()
            e.stopPropagation();
            e.preventDefault();
        }
    }
    return <a {...{...props, href}} onClick={onClick}>{props.children}</a>
}