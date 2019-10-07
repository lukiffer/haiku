[![CircleCI](https://circleci.com/gh/lukiffer/haiku.svg?style=svg)](https://circleci.com/gh/lukiffer/haiku)

# haiku
A collection of cards and other web components for the Home Assistant Lovelace UI.


## Features
Haiku provides a common-sense, intuitive UI for your smart home. Haiku is designed to present your smart home controls
in a way that's easy and intuitive to navigate, progressively exposing controls for your home, for a room, for a group
of devices in a room, and for the devices themselves.

This progressive granularity is customizable as are the grouping and naming of devices. This extends the philosophy
behind Lovelace of separating _logical_ grouping of devices from _interface-specific_ grouping and naming.

> For example, in a global context like calling the API or the HA states interface, more specific names are relevant
(such as "Master Bedroom Ceiling Fan Light 1"). However this naming becomes cumbersome in your day-to-day interface.
By nesting your entities into progressively more specific groups you can achieve the same amount of context with
significantly less clutter. (e.g. Master Bedroom > Lights > Ceiling Fan Lights > Ceiling Fan Light 1).

![Haiku UI Example](/docs/example.gif "Haiku UI Example")


## Installation and Configuration

Installation will vary slightly depending on your Home Assistant setup. The steps below will cover most installations,
but if you have a scenario where these instructions don't work, feel free to [open an issue](https://github.com/lukiffer/haiku/issues)
and we'll either amend these instructions or provide a workaround.

### Enable YAML Configuration Mode

To enable YAML configuration mode, open your `configuration.yaml` in your Home Assistant config directory, and add
or update the `lovelace:` key:

```yaml
lovelace:
  mode: yaml
```
This will tell Home Assistant that you want to use a configuration file (rather than the UI) to configure the front-end.

Note that you'll also need to use a modern web browser (or client) – one compatible the (now-deprecated) `frontend: latest`
setting. The latest versions of Chrome, Webkit, Firefox, Edge, and Opera all work fine, as well as the latest mobile browsers.

### Update the Lovelace Configuration

After making the above change, restarting Home Assistant will create a `ui-lovelace.yaml` file in your configuration
directory. At the top level of that document, add the `resources` key and any of the resource files you want to use from
Haiku.

```yaml
resources:
  - url: https://unpkg.com/@haiku-ui/haiku/dist/cards/haiku-room-card.js
    type: module
  - url: https://unpkg.com/@haiku-ui/haiku/dist/cards/haiku-global-config.js
    type: module
views:
  - title: Overview
    icon: mdi:home
    # ...
    cards:
      - type: "custom:haiku-global-config"
      - type: "custom:haiku-room-card"
        name: Master Bedroom
        entities:
          - group.lighting_master_bedroom
          - sensor.lumi_lumiweather_022cc5ba_1_1026
          - sensor.lumi_lumiweather_022cc5ba_1_1029
          - fan.ge_12730_fan_control_switch_level
          # etc
```

- `custom:haiku-global-config` adds a global cog menu to the UI that allows you to select a theme and set other global settings for Haiku.
Note that this will display only as a cog menu in the bottom right - no card will be rendered.
- `custom:haiku-room-card` adds a "room" card and renders tiles for each entity included in that card's config.

### Pinning a Version of Haiku

Haiku is distributed as an [NPM package](https://www.npmjs.com/package/@haiku-ui/haiku) and served via [unpkg.com](https://unpkg.com).
You can reference any specific version using unpkg's version notation:


#### Pin to a Specific Version
```yaml
resources:
  - url: https://unpkg.com/@haiku-ui/haiku@0.1.2/dist/cards/haiku-room-card.js
    type: module
```

#### Pin to a Range (Semver)

```yaml
resources:
  - url: https://unpkg.com/@haiku-ui/haiku@^0.1.0/dist/cards/haiku-room-card.js
    type: module
```

## Customization

Each room card can be configured with these options:

- `name` is the room name displayed at the bottom of the card
- `entities` is an array of entities or groups (defined in `groups.yaml`)
- `background_image` any valid CSS value for `background-image`
  - You can specify the image from a camera feed by specifying `background-image: "url('http://hassio.local:8123/your_camera_image_feed')"`
  - You can also specify a `url(...)` for a static image (you can host these externally or place them in your www folder and reference
    them from there).
  - You can specify other valid CSS values like gradients `background_image: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)"`

As mentioned above, a fully-descriptive name is more useful in a global context. If you want to customize the options for a
group or entity in Haiku, you can hold <kbd>alt</kbd> or <kbd>option</kbd> and click the tile for the entity you want to customize.
This allows you to edit the `haiku_type` and `haiku_label` custom properties.

You can also edit these properties in your `customize.yaml` directly:

```yaml
fan.ge_12730_fan_control_switch_level:
  haiku_label: Ceiling Fan

switch.example_light_switch:
  haiku_label: Kitchen Light Switch
  haiku_type: light
```

- `haiku_label` can be any string value
- `haiku_type` should be one of:
  - `light`
  - `temperature`
  - `humidity`
  - `smoke_binary`
  - `co_binary`
  - `air_quality`
  - `motion_binary`

## Developing and Contributing

### Development Setup

**Note the steps described here only work on Linux, macOS, and Windows Subsystem for Linux.**

Start by configuring your `ui-lovelace.yaml` to point at itself to serve the Haiku files:

```yaml
resources:
  - url: /local/haiku/cards/haiku-room-card.js
    type: module
  - url: /local/haiku/cards/haiku-global-config.js
    type: module
```

Then, clone this repository and start developing with a few commands:

```bash
npm install -g gulp
npm ci

export HA_SSH_USER=pi
export HA_SSH_HOST=example.local

gulp watch
```

The `watch` command will watch the `src/**/*` glob pattern, rebuild the package on changes, and call the `deploy.sh` script.

The deployment script makes some assumptions that you have key-based SSH authentication. It also assumes the destination
directory to be `/home/homeassistant/.homeassistant/www/haiku`

You can call the `deploy.sh` script with the following arguments to customize these options:

- `--ssh-port` - the port over which SSH (rsync) traffic will occur
- `--ssh-user` - the username used to connect to the Home Assistant server via SSH
- `--ssh-host` - the hostname (or IP address) of the Home Assistant server
- `--haiku-path` - the full path from which Haiku will be served by Home Assistant

### Contributing

This is a fun project for exploring Polymer and Lovelace -- one that satisfies my own personal needs for Home Assistant. PRs
are welcome, but I can't make any guarantees as to my availability for PR reviews or bug fixes. Forking and customizing for your
needs might be the quickest path.
