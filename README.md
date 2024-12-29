# Terraform Format Extension

This VS Code extension automatically formats Terraform files when you save them, using the `terraform fmt` command.

## Features

- Automatically formats `.tf` and `.tfvars` files on save
- Uses the official `terraform fmt` command for formatting
- Shows detailed error messages for invalid HCL syntax
- Cross-platform support (Windows, Linux, macOS)

## Requirements

- Visual Studio Code 1.60.0 or higher
- Terraform CLI installed and available in your system PATH

## Extension Settings

This extension doesn't require any additional settings.

## Known Issues

- The terraform CLI must be installed and accessible in your system PATH
- Formatting may take a moment on larger files
- You might see a warning about "No view is registered with id: terraform.cloud.run.apply" - this can be safely ignored as it's related to the official HashiCorp Terraform extension, not this formatting extension

## Release Notes

### 1.1.0

- Improved error messages for invalid HCL syntax
- Added specific error messages for common Terraform formatting issues
- Removed debug logging for production release

### 1.0.0

Initial release of Terraform Format extension 