import { APP_ADDON_NAME } from '#config/env'
import bindings from 'bindings'
import plugin from 'fastify-plugin'

export const audiotoolsAddon = plugin((app) => {
  const { analyze, applyGain, reverse } = bindings(APP_ADDON_NAME)
  app.decorate('addons', { applyGain, reverse, analyze })
})
