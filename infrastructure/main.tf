provider "azurerm" {
 features {}
}

locals {
  vaultName = "${var.product}-kv-${var.env}"
}

data "azurerm_key_vault" "key_vault" {
  name = local.vaultName
  resource_group_name = "${var.product}-${var.env}"
}

module "sptribs-dss-update-case-web-session-storage" {
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product                       = var.product
  location                      = var.location
  env                           = var.env
  common_tags                   = var.common_tags
  redis_version                 = "6"
  business_area                 = "cft"
  private_endpoint_enabled      = true
  public_network_access_enabled = false
  sku_name                      = var.sku_name
  family                        = var.family
  capacity                      = var.capacity
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "redis-access-key"
  value        = module.sptribs-frontend-session-storage.access_key
  content_type = "terraform-managed"

  tags = merge(var.common_tags, {
    "source" : "redis ${module.sptribs-frontend-session-storage.host_name}"
  })

  key_vault_id = data.azurerm_key_vault.sptribs_key_vault.id
}
