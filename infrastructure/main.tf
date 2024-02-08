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

data "azurerm_redis_cache" "sptribs_dss_update_case_web_session_storage" {
  name                = "sptribs-cache-${var.env}"
  resource_group_name = "sptribs-cache-${var.env}"
}

output "primary_access_key" {
  value = data.azurerm_redis_cache.sptribs_dss_update_case_web_session_storage.primary_access_key
}

output "hostname" {
  value = data.azurerm_redis_cache.sptribs_dss_update_case_web_session_storage.hostname
}
