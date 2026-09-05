/**
 * Le seul préréglage nécessaire : babel-preset-expo ajoute lui-même le plugin
 * worklets de Reanimated quand le paquet est installé. Ce fichier existe pour jest,
 * qui ne bénéficie pas de la configuration implicite de Metro.
 */
module.exports = function (api) {
  api.cache(true)
  return { presets: ['babel-preset-expo'] }
}
