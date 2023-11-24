import express, { Application } from "express"

import { AuthRoute, TeamRoute, UserRoute } from "../routes"
import cors from "cors"

export default async (app: Application) => {
  app.use(express.json())
  app.use(cors({ origin: true }))
  app.use(express.urlencoded({ extended: true }))

  app.use("/auth", AuthRoute)
  app.use("/user", UserRoute)
  app.use("/team", TeamRoute)

  return app
}
