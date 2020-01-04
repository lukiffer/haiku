#!/bin/bash

set -e

function assert_not_empty {
  local -r arg_name="$1"
  local -r arg_value="$2"

  if [[ -z "$arg_value" ]]; then
    echo "ERROR: The value for '$arg_name' cannot be empty"
    print_usage
    exit 1
  fi
}

function deploy() {
  local ssh_port="22"
  local ssh_user="$HA_SSH_USER"
  local ssh_host="$HA_SSH_HOST"
  local haiku_path="/home/homeassistant/.homeassistant/www/haiku/"

  while [[ $# -gt 0 ]]; do
    local key="$1"

    case "$key" in
      --ssh-port)
        ssh_port="$2"
        shift
        ;;
      --ssh-user)
        ssh_user="$2"
        shift
        ;;
      --ssh-host)
        ssh_host="$2"
        shift
        ;;
      --haiku-path)
        haiku_path="$2"
        shift
        ;;
      *)
        echo "ERROR: Unrecognized argument: $key"
        exit 1
        ;;
    esac

    shift
  done

  assert_not_empty "--ssh-user" "$ssh_user"
  assert_not_empty "--ssh-host" "$ssh_host"

  script_path="$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )"
  rsync -aviO -e "ssh -p $ssh_port -o StrictHostKeyChecking=no" "$script_path/../../dist/" "$ssh_user@$ssh_host:$haiku_path"
}

deploy "$@"
