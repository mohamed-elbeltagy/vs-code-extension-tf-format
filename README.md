# Terraform Format Extension

This VS Code extension automatically formats Terraform files when you save them, using the `terraform fmt` command.

## Features

- Automatically formats `.tf` and `.tfvars` files on save
- Uses the official `terraform fmt` command for formatting
- Shows error messages if formatting fails

## Requirements

- Visual Studio Code 1.60.0 or higher
- Terraform CLI installed and available in your system PATH

## Extension Settings

This extension doesn't require any additional settings.

## Known Issues

- The terraform CLI must be installed and accessible in your system PATH
- Formatting may take a moment on larger files

## Release Notes

### 1.0.0

Initial release of Terraform Format extension 