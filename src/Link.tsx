import { h } from "harmaja"
import { RoutePath, RouteMap } from "./types";
import { ReactiveRouter } from "./ReactiveRouter";

type LinkProps<Routes> = JSX.DetailedHTMLProps<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> 
& (Routes extends RouteMap<infer R> ? {
    href: RoutePath<R>
} : never)

export function Link<Routes>( props: LinkProps<Routes> ) {
    const onClick = (e: JSX.MouseEvent) => {
        if (!(e.altKey || e.shiftKey)) {


            // TODO: how to pass the router here? Cannot include in the route handlers
            // (try to type it...). Would be the perfect case for Context in harmaja
            // indeed.

            e.stopPropagation();
            e.preventDefault();
        }
    }
    return <a {...props} onClick={onClick}>{props.children}</a>
}