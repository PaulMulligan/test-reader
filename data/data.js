var gameData = {
    "start": {
        "text": ["This is the starting file.", "$ROOM1.", "$ROOM2.", "$ROOM3.", "$ROOM4.", "$ROOM5.", "$ROOM6", "$ROOM7", "$ROOM8"],
        "choices": [{
            "value": "$ROOM1",
            "text": "Go to the room with a key",
            "entry": "key"
        },{
            "value": "$ROOM2",
            "text": "Go to the random room",
            "entry": "random"
        },{
            "value": "$ROOM3",
            "text": "Go through the locked door (requires a key)",
            "entry": "locked",
            "condition": {
                "type": "item",
                "item": "key"
            }
        },{
            "value": "$ROOM4",
            "text": "Go to the lever room",
            "entry": "gamble"
        },{
            "value": "$ROOM5",
            "text": "Go to the cash room",
            "entry": "cash"
        },{
            "value": "$ROOM6",
            "text": "Go to the shop room",
            "entry": "shop"
        },{
            "value": "$ROOM7",
            "text": "Go to the poison room",
            "entry": "poison"
        },{
            "value": "$ROOM8",
            "text": "Go to the combat room",
            "entry": "combat"
        }]
    },
    "combat": {
    	"text": ["This room contains a goblin fighter."],
        "choices": [{
            "value": "Go to start.",
            "text": "Go to start.",
            "entry": "start"
        }],
        "combat": {
            "name": "GOBLIN",
        	"stamina": "10",
            "skill": "2",
            "fail": {
            	"text": "You were killed by the goblin"
            },
            "win": {
            	"text": "You won and found 5 gold. Go to start.",
            	"stat": "money",
            	"modifier": 5,
            	"entry": "start",
            	"value": "Go to start."
            }
        }
    },
    "poison": {
    	"text": ["This room was probably a bad idea. Go to start."],
        "choices": [{
            "value": "Go to start.",
            "text": "Go to start.",
            "entry": "start"
        }],
        "effects": [{
            "effect": "stat-change",
            "text": "The poison from earlier finally takes effect, and you lose some health",
            "stat": "stamina",
            "modifier": -5,
            "delay": 2
        }]
    },
    "random": {
        "text": ["This room is random and twisty. It will send you to a $RANDOM."],
        "choices": [{
            "value": "$RANDOM",
            "text": "random room",
            "random": ["key", "start"]
        }]
    },
    "cash": {
        "text": ["This room makes you feel wealthier. Go to start."],
        "choices": [{
            "value": "Go to start.",
            "text": "Go to start.",
            "entry": "start"
        }],
        "effects": [{
            "effect": "stat-change",
            "stat": "money",
            "modifier": 1
        }]
    },
    "shop": {
        "text": ["This room has an automatic vending machine where you can buy and sell things. Go to start."],
        "choices": [{
            "value": "Go to start.",
            "text": "Go to start.",
            "entry": "start"
        }],
        "shop": [{
            "item": "candy",
            "buysFor": 1,
            "sellsFor": 5
        },{
            "item": "magicsword",
            "buysFor": 50,
            "sellsFor": null
        }]
    },
    "gamble": {
        "text": ["There is a magic lever here. $PULL. Go to start."],
        "choices": [{
            "value": "Go to start.",
            "text": "Go to start.",
            "entry": "start"
        }],
        "tests": [{
            "value": "$PULL",
            "text": "Pull the lever (MAGIC vs 10)",
            "stat": "magic",
            "goal": 10,
            "success": {
                "text": "You manage to pull the lever down, and ten gold falls from the ceiling.",
                "effect": "stat-change",
                "stat": "money",
                "modifier": 10
            },
            "failure": {
                "text": "Some mysterious force resists you when you try to pull the lever.",
            }
        }]
    },
    "1": {
        "text": ["This is the first entry. Go to second entry."],
        "choices": [{
            "value": "Go to second entry.",
            "text": "Go to second entry.",
            "entry": "two"
        }]
    },
    "two": {
        "text": ["This is the second entry. $FIRST"],
        "choices": [{
            "value": "$FIRST",
            "text": "Go to first entry.",
            "entry": "1"
        }]
    },
    "key": {
        "text": ["This is an empty room. There is a $KEY on the floor. Go to start."],
        "choices": [{
            "value": "Go to start.",
            "text": "Go to start.",
            "entry": "start"
        }],
        "items": [{
            "value": "$KEY",
            "text": "key",
            "item": "key"
        }]
    },
    "locked": {
        "text": ["This is an empty room that was previously locked. There is a $SWORD here. Go to start."],
        "choices": [{
            "value": "Go to start.",
            "text": "Go to start.",
            "entry": "start"
        }],
        "items": [{
            "value": "$SWORD",
            "text": "sword",
            "item": "magicsword"
        }]
    }
};
var itemData = {
    "key": {
        "name": "Small key",
        "description": "A small key"
    },
    "magicsword": {
        "name": "Magic Sword (COM+1)",
        "description": "A glowing sword that provides Combat +1",
        "bonus": {
            "stat": "bonuscombat",
            "modifier": 1
        }
    },
    "candy": {
        "name": "Candy",
        "description": "A piece of generic candy"
    }
};