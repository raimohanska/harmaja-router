import { h } from "harmaja"
import { RoutePath, RouteMap, RoutesOf } from "./types";
import { ReactiveRouter } from "./ReactiveRouter";
import { withRouter } from "./HarmajaRouter";

type LinkProps<Routes> = JSX.DetailedHTMLProps<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> 
& {
    href: RoutePath<RoutesOf<Routes>>
}

export function Link<Routes>( props: LinkProps<Routes> ) {
    type R = RoutesOf<Routes>
    let router: ReactiveRouter<R>
    withRouter<R>(r => router = r)
    const href = props.href
    const onClick = (e: JSX.MouseEvent) => {
        if (!(e.altKey || e.shiftKey)) {
            router.navigateByPath(href)
            e.stopPropagation();
            e.preventDefault();
        }
    }
    return <a {...props} onClick={onClick}>{props.children}</a>
}