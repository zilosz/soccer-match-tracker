FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm backend deploy --prod /prod/backend
RUN pnpm frontend deploy --prod /prod/frontend

FROM base AS backend
WORKDIR /prod/backend
COPY --from=build /prod/backend .
EXPOSE 8080
CMD [ "pnpm", "start" ]

FROM nginx:alpine AS frontend
COPY --from=build /prod/frontend/dist /usr/share/nginx/html
COPY --from=build /prod/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
