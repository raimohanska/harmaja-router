import * as L from "lonna"

type SplitBy<Delim extends string, Input> = Input extends `${infer First}${Delim}${infer Rest}`
    ? [First, ...SplitBy<Delim, Rest>]
    : [Input]

type SplitEach<Delim extends string, Input> = Input extends [infer Head, ...infer Tail]
    ? [...SplitBy<Delim, Head>, ...SplitEach<Delim, Tail>]
    : []

type Split<Input> = SplitEach<"/", [Input]>
type ParamsFrom<Parts> = Parts extends [infer First, ...infer Rest]
    ? First extends `:${infer Param}`
        ? Param | ParamsFrom<Rest>
        : ParamsFrom<Rest>
    : never

type ParamsObjectFrom<Parts> = Record<
  ParamsFrom<Parts>,
  string
>    

export type PathParams<S extends string> = ParamsObjectFrom<Split<S>>
type ValidPathPart<PartKey extends string> = PartKey extends `:${infer Param}` ? string : PartKey

type ValidPathFrom<Parts> = Parts extends [infer First, infer Second, ...infer Rest]
    ? First extends string // TODO: accepts empties
        ? `${ValidPathPart<First>}/${ValidPathFrom<[Second, ...Rest]>}`
        : never
    : Parts extends [infer First]
    ? First extends string // TODO: accepts empties
        ? `${ValidPathPart<First>}`
        : never
    : never
type ValidPathForKey<S extends string> = ValidPathFrom<Split<S>> & string
export type RouteHandler<Params, Result> = (params: Params) => Result
export type RouteMap<R> = {
    [Path in keyof R]: Path extends string ? RouteHandler<PathParams<Path>, R[Path]> : never
}
export type RouteKey<R> = keyof R & string
export type RouteResult<R> = ReturnType<RouteMap<R>[keyof R]>
export type RoutePath<R> = ValidPathForKey<keyof R & string>

export type RouteMatch<R> = {
    routeKey: RouteKey<R>
    path: RoutePath<R>
    result: RouteResult<R>
}