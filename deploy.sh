rsync -aviO -e "ssh -p $HA_SSH_PORT -o StrictHostKeyChecking=no" ./haiku/ $HA_SSH_USER@$HA_SSH_HOST:/home/homeassistant/.homeassistant/www/haiku/
