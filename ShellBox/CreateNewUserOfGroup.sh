#!/usr/bin/env bash
echo 'INPUT USER NAME:'
read NEW_USER
if [[ ${NEW_USER} ]]; then
    echo 'INPUT GROUP NAME (DEFAULT viewer):'
    read GROUP
    if [[ ${GROUP} ]]; then
    echo "Confirmed";
    else
    GROUP='viewer'
    echo "Group would use default";
    fi
else
echo "EMPTY USER NAME LED TO DEATH"
exit 1
fi

echo "Creating User ${NEW_USER} in Group ${GROUP} ..."

groupadd ${GROUP};
useradd -g ${GROUP} ${NEW_USER};
mkdir /home/${NEW_USER};
chown ${NEW_USER}:${GROUP} /home/${NEW_USER};

echo "Executed. DO NOT FORGET TO INITIALIZE PASSWORD FOR USER WITH"
echo "passwd ${NEW_USER}"