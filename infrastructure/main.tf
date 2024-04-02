provider "azurerm" {
 features {}
}

locals {
  vaultName = "${var.product}-${var.env}"
}

data "azurerm_key_vault" "key_vault" {
  name = local.vaultName
  resource_group_name = "sptribs-${var.env}"
}

data "azurerm_key_vault" "s2s_vault" {
  name                = "s2s-${var.env}"
  resource_group_name = "rpe-service-auth-provider-${var.env}"
}

data "azurerm_key_vault_secret" "microservicekey_sptribs_dss_update_case_web" {
  name         = "microservicekey-sptribs-dss-update-case-web"
  key_vault_id = data.azurerm_key_vault.s2s_vault.id
}

resource "azurerm_key_vault_secret" "s2s-secret" {
  name         = "s2s-secret-sptribs-dss-update-case-web"
  value        = data.azurerm_key_vault_secret.microservicekey_sptribs_dss_update_case_web.value
  content_type = "terraform-managed"

  tags = merge(var.common_tags, {
    "source" : "vault ${data.azurerm_key_vault.s2s_vault.name}"
  })

  key_vault_id = data.azurerm_key_vault.sptribs_key_vault.id
}

data "azurerm_redis_cache" "sptribs_dss_update_case_web_session_storage" {
  name                = "sptribs-${var.env}"
  resource_group_name = "sptribs-cache-${var.env}"
}

output "primary_access_key" {
  value     = data.azurerm_redis_cache.sptribs_dss_update_case_web_session_storage.primary_access_key
  sensitive = true
}

output "hostname" {
  value = data.azurerm_redis_cache.sptribs_dss_update_case_web_session_storage.hostname
}
