# haiku
A collection of cards and other web components for the Home Assistant Lovelace UI.


## Features
Haiku provides a common-sense, intuitive UI for your smart home. Haiku is designed to present your smart home controls
in a way that's easy and intuitive to navigate, progressively exposing controls for your home, for a room, for a group
of devices in a room, and for the devices themselves.

This progressive granularity is customizable as are the grouping and naming of devices. This extends the philosophy
behind Lovelace of separating logical grouping of devices from interface-specific grouping and naming.

For example, in a global context like calling the API or the HA management interface, more specific names are relevant
(such as "Master Bedroom Ceiling Fan Light 1"). However this naming becomes cumbersome in your day-to-day interface,
and by organizing these and nesting them, you can achieve the same amount of context with significantly less clutter
(e.g. Master Bedroom > Lights > Ceiling Fan Lights > Ceiling Fan Light 1).

![Haiku UI Example](/docs/example.gif "Haiku UI Example")


## Installation and Configuration
Installation will vary depending on your Home Assistant setup. In all scenarios, you'll need to setup Lovelace by
following the instructions found [here](https://www.home-assistant.io/lovelace/).


### Using SSH and NPM
If you have SSH access to your Home Assistant instance and [NodeJS](https://nodejs.org/)
installed, change into the www directory below your config directory and install haiku:

```bash
cd /user/homeassistant/.homeassistant/www/
npm install @haiku-ui/haiku
```

This will install haiku into `node_modules` under your `www` directory. You can then reference custom cards by
adding the following to your `ui-lovelace.yaml` file:

```yaml
resources:
  - url: /local/node_modules/haiku/cards/haiku-global-config.js
    type: module
  - url: /local/node_modules/haiku/cards/haiku-room-card.js
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

### Alternate Installation

Alternatively, you can download a ZIP archive of the latest [release](https://github.com/lukiffer/haiku/releases) (note you'll download
the package, not the source files) and copy these to wherever your Home Assistant `www` directory is.

Also note that you'll need to change the paths from the `ui-lovelace.yaml` file example above to not include a `node_modules` directory.


### Customization

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

You can clone this repository and start developing with a few commands:

```bash
npm install -g gulp
npm install

export HA_SSH_PORT=22
export HA_SSH_USER=pi
export HA_SSH_HOST=example.local

gulp watch
```

The `watch` command will watch the `src/**/*` glob pattern, rebuild the package on changes, and call the `deploy.sh` script.

The deployment script makes some assumptions that you have key-based SSH authentication. It also assumes the destination
directory to be `/home/homeassistant/.homeassistant/www/haiku` You can customize this script as necessary.


### Contributing

This is a fun project for exploring Polymer and Lovelace -- one that satisfies my own personal needs for Home Assistant. PRs
are welcome, but I can't make any guarantees as to my availability for PR reviews or bug fixes. Forking and customizing for your
needs might be the quickest path.
