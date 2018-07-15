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
  - url: /local/node_modules/haiku/cards/haiku-room-card.js
    type: module
views:
  - tab_icon: mdi:home
    # ...
    cards:
      - type: "custom:haiku-room-card"
        name: Master Bedroom
        class: bedroom
        entities:
          - group.lighting_master_bedroom
          - sensor.lumi_lumiweather_022cc5ba_1_1026
          - sensor.lumi_lumiweather_022cc5ba_1_1029
          - fan.ge_12730_fan_control_switch_level
          # etc
```

### Alternate Installation

As an alternate installation, you can extract the `haiku` directory from the NPM package and manually deploy it to your
Home Assistant instance. Be sure to update the `resources` definition in the `ui-lovelace.yaml` file depending on where
you deploy the `haiku` directory.


### Customization

Each room card can be configured with these options:

- `name` is the room name displayed at the bottom of the card
- `class` is the type of room that will determine the background image based on theme (any of 
`bedroom`, `bedroom-alternate`, `recreation`, `living-room`, `kitchen`, or `dining-room`)
- `entities` is an array of entities or groups (defined in `groups.yaml`)

As mentioned above, a fully-descriptive name is more useful in a global context. If you want to customize the name of a
group or entity in Haiku, simply go to the Customization section of your config and add a custom `haiku_label` attribute
to the group or entity or edit your `customize.yaml` directly:

```yaml
fan.ge_12730_fan_control_switch_level:
  haiku_label: Ceiling Fan
```

## Developing and Contributing


### Development Setup
You can clone this repository and start developing with a few commands:

```bash
npm install -g gulp
npm install
gulp watch
```

The `watch` command will watch the `src/**/*` glob pattern, rebuild the package on changes, and call the `deploy.sh` script.

The deployment script makes some assumptions that you have key-based SSH authentication and you're `pi@raspberrypi` is a valid
SSH target. It also assumes the destination directory to be `/home/homeassistant/.homeassistant/www/haiku` You can customize
this script as necessary.


### Contributing
This is a fun project for exploring Polymer and Lovelace -- one that satisfies my own personal needs for Home Assistant. PRs
are welcome, but I can't make any guarantees as to my availability for PR reviews or bug fixes. Forking and customizing for your
needs might be the quickest path.
