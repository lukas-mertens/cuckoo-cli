oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cuckoo-cli
$ cuckoo-cli COMMAND
running command...
$ cuckoo-cli (--version)
cuckoo-cli/0.0.0 linux-x64 node-v14.17.1
$ cuckoo-cli --help [COMMAND]
USAGE
  $ cuckoo-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cuckoo-cli help [COMMAND]`](#cuckoo-cli-help-command)
* [`cuckoo-cli plugins`](#cuckoo-cli-plugins)
* [`cuckoo-cli plugins:inspect PLUGIN...`](#cuckoo-cli-pluginsinspect-plugin)
* [`cuckoo-cli plugins:install PLUGIN...`](#cuckoo-cli-pluginsinstall-plugin)
* [`cuckoo-cli plugins:link PLUGIN`](#cuckoo-cli-pluginslink-plugin)
* [`cuckoo-cli plugins:uninstall PLUGIN...`](#cuckoo-cli-pluginsuninstall-plugin)
* [`cuckoo-cli plugins update`](#cuckoo-cli-plugins-update)

## `cuckoo-cli help [COMMAND]`

Display help for cuckoo-cli.

```
USAGE
  $ cuckoo-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for cuckoo-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `cuckoo-cli plugins`

List installed plugins.

```
USAGE
  $ cuckoo-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ cuckoo-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `cuckoo-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ cuckoo-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ cuckoo-cli plugins:inspect myplugin
```

## `cuckoo-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ cuckoo-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ cuckoo-cli plugins add

EXAMPLES
  $ cuckoo-cli plugins:install myplugin 

  $ cuckoo-cli plugins:install https://github.com/someuser/someplugin

  $ cuckoo-cli plugins:install someuser/someplugin
```

## `cuckoo-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ cuckoo-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ cuckoo-cli plugins:link myplugin
```

## `cuckoo-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ cuckoo-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cuckoo-cli plugins unlink
  $ cuckoo-cli plugins remove
```

## `cuckoo-cli plugins update`

Update installed plugins.

```
USAGE
  $ cuckoo-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
