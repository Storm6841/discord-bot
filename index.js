const Discord = require("discord.js");
const db = require('quick.db'); 
// Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.
// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
//so u know what the problem is? 
var devs = ['598255408850927618', '602259629820346385', '592037552731455513']
const ownerID = "592037552731455513"; 
const client = new Discord.Client();
let prefix = PREFIX; 
PREFIX = k!;
let bot = client; 
bot.commands = new Discord.Collection();

client.on("debug", (e) => console.info(e));
client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully. 
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    console.log("Connected as " + client.user.tag) 
    console.log(` `);
    console.log(`Will Now be Logging Commands`);
    console.log(`====================================`);
    console.log(`Command Logs:`);
    console.log(` `);  
client.user.setActivity(`Prefix ${prefix}`, {type: "LISTENING"}) 
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
client.channels.get('598335234425094146').send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
client.user.setActivity(`Prefix ${prefix}`, {type: "LISTENING"}) 
});

client.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
  client.channels.get('598280317404577892').send(`New User "${member.user.username}" has joined "${member.guild.name}"`)
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
client.channels.get('598335234425094146').send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
client.user.setActivity(`Prefix ${prefix}`, {type: "LISTENING"}) 
});

client.on("message", async (message) => {   
  // This event will run on every single message received, from any channel or DM.
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot)return;
  
  if(!message.content.startsWith(prefix))return;
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
	console.log(`${message.author.tag} used "ping" command.`);
    client.channels.get("598335234425094146").send(`${message.author.tag} used "ping" command.`);
  }
  
  if(command === 'balance' || command === 'bal') {
   let user = message.mentions.users.first() || message.author;
    let balance = await db.fetch(`money.${user.id}`);
    if(balance === null) balance = 0;
console.log(balance) 

    message.channel.send({embed: {
        title: `${user.tag} Balance`,
        color: 0x66cc00,
        description: `**$${balance}**`
    }});

  }
  
  if(command === 'rob') {
    

    let user = message.mentions.members.first()
    let targetuser = await db.fetch(`bal--${user.id}`) // fetch mentioned users balance
    let author = await db.fetch(`bal--${message.author.id}`) // fetch authors balance


    if (!user) {
        return message.channel.send('User not found.')
    }
    if (author < 500) { // if the authors balance is less than 500, return this.
        return message.channel.send(`You need at least $500 to rob somebody.`)
    }

    if (targetuser <= 0) { // if mentioned user has 0 or less, it will return this.
        return message.channel.send(`${user.user.username} does not have anything to rob.`)
    }


    let random = Math.floor(Math.random() * 500) + 1; // random number 500-1, you can change 500 to whatever you'd like


    let embed = new Discord.RichEmbed()
    .setDescription(`${message.author} you robbed ${user} and got away with ${random}!`)
    .setColor("GREEN")
    .setTimestamp()
    message.channel.send(embed)


    db.subtract(`bal--${user.id}`, random)
    db.add(`bal--${message.author.id}`, random)
  }
	
  if(command === 'work') {
    console.log(await db.fetch(`money.${message.author.id}`))
    var max = 100
    var min = 20
    var random = Math.random() * (+max - +min) + +min; 
    var bal = Math.round(random)
    db.add(`money.${message.author.id}`, bal);
    message.channel.send('You earned $' + bal)
  }
  
  if(command === 'autowork') {
    let status = await db.fetch(`${message.author.id}.autowork`)
    if(status === 1) return message.channel.send(`You already have autowork on! Use --end first`)
    var max = 100
    var min = 20
    console.log(`${message.member.tag} has started to autowork`)
     client.autowork = setInterval(function() {
      var random = Math.random() * (+max - +min) + +min; 
    var bal = Math.round(random)
      db.add(`money.${message.author.id}`, bal);
      message.channel.send(`${message.author} earned $${bal}`) 
    }, 10000)
    message.channel.send(`Autowork Started. Use ${prefix}end to stop.`)
    db.add(`${message.author.id}.autowork`, 1)
  }
  if(command === 'end') {
    let autostatus = await db.fetch(`${message.author.id}.autowork`)
    if(autostatus !== 1) return message.channel.send(`Autowork is not enabled.`)
    db.subtract(`${message.author.id}.autowork`, 1)
    clearInterval(client.autowork)
    message.channel.send(`Ending Autowork`)
    
  }

   if(command === 'add') { 
    if(!devs.includes(message.author.id)) return message.channel.send(`You can't do that.`)
    let user = message.mentions.users.first() || args[0]
    if(!user) return message.channel.send(`Couldn't find user.`)
    if(args.slice(1).join(" ") === 'all') {
      var amt = await db.fetch(`money.${user.id}`)
    } else {
    var amt = parseInt(args.slice(1).join(" "), 10)
    }
    console.log(amt)
    if(!amt) return message.channel.send(`Couldn't find amount.`)
    db.add(`money.${user.id}`, amt)
    var oldbal = await db.fetch(`money.${user.id}`)-amt
    var newbal = await db.fetch(`money.${user.id}`)
    let balembed = new Discord.RichEmbed()
    .setTitle(`Balance Added`)
    .addField('Old Balance', oldbal)
    .addField('New Balance', newbal)
    .addField('Amount Added', amt)
    .setColor('GREEN')
    message.channel.send(balembed)
  } 
  
  if(command === 'remove') {
    if(!devs.includes(message.author.id)) return message.channel.send(`You can't do that.`)
    let user = message.mentions.users.first()  
     let balance = await db.fetch(`money.${user.id}`);
    console.log(balance)
    if(!user) return message.channel.send(`Couldn't find user.`)
    if(args.slice(1).join(' ') === 'all') {
      var amt = balance
    } else {
    var amt = parseInt(args.slice(1).join(' '), 10)
    }
    console.log(amt)
    if(!amt) return message.channel.send(`Couldn't find amount.`)
    db.subtract(`money.${user.id}`, amt)
    var oldbal = await db.fetch(`money.${user.id}`)+amt
    var newbal = await db.fetch(`money.${user.id}`)
    let balembed = new Discord.RichEmbed()
    .setTitle(`Balance Removed`)
    .addField('Old Balance', oldbal)
    .addField('New Balance', newbal)
    .addField('Amount Removed', amt)
    .setColor('RED')
    message.channel.send(balembed)
  }
  if(command === 'pay') {
     let user = message.mentions.users.first() || args[0]

    let mybal = db.fetch(`money.${message.author.id}`)
    if(args[1] === 'all') {
      let amt = mybal
    } else {
      let amt = args[1]
    }


    if (!user) {
        return message.channel.send(`Couldn't find user.`)
    }
    if(user === message.author) {
      return message.channel.send(`You can't pay yourself!`)
    }
    
    if(user.bot) {
     return message.channel.send(`You can't pay a bot!`)
    }
  
    if (!amt) {
        return message.channel.send('Please specify an amount.')
    }  if (amt.includes('-')) { // if the message includes "-" do this.
        return message.channel.send(`You can't pay a negative amount!`)
    }

    if (mybal < amt) {
        return message.channel.send(`You don't have enough money.`) 
    }
    db.add(`money.${user.id}`, parseInt(amt, 10))
    db.subtract(`money.${message.author.id}`, parseInt(amt, 10))
    let youroldbal = await db.fetch(`money.${message.author.id}`)+parseInt(amt, 10)
    let yournewbal = await db.fetch(`money.${message.author.id}`)
    let theiroldbal = await db.fetch(`money.${user.id}`)-parseInt(amt, 10)
    let theirnewbal = await db.fetch(`money.${user.id}`)
    
    let payEmbed = new Discord.RichEmbed()
    .setTitle(`Amount Payed`)
    .addField(`Your Money`, `Former: $${youroldbal}\n Now: $${yournewbal}`)
    .addField(`${user.user.username}'s Money`, `Former: $${theiroldbal}\n Now: $${theirnewbal}`)
    .setColor(`#ffa500`)
    message.channel.send(payEmbed)
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
	console.log(`${message.author.tag} used "say" command. Check #deleted-messages-log to see the original message. `);
    client.channels.get("598335234425094146").send(`${message.author.tag} used "say" command. Check #deleted-messages-log to see the original message.`);
  }
  
  else if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Admin"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
	 console.log(`${message.author.tag} used "kick" command. ${member.user.tag} has been kicked by ${message.author.tag} because: ${reason} `);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "kick" command. 
    ${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  else if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator", "Admin"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
	console.log(`${message.author.tag} used "ban" command. ${member.user.tag} has been banned by ${message.author.tag} because: ${reason} `);
    client.channels.get("598335234425094146").send(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    const deleteCount = parseInt(args[0], 10);
    if(!message.member.roles.some(r=>["Owner", "Admin", "Moderator", "Staff"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

      if(!deleteCount || deleteCount < 5 || deleteCount > 1000)
      return message.reply("Please provide a number between 5 and 1000 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
      console.log(`${message.author.tag} used "prune" command`);
      client.channels.get("598335234425094146").send(`${message.author.tag} Used the "prune" command. 
      Check #deleted-messages-log to see what was deleted.`);
  }
  
  if (command === "asl") {
  let age = args[0]; // Remember arrays are 0-based!.
  let sex = args[1];
  let location = args[2];
  message.reply(`Hello ${message.author.username}, I see you're a ${age} year old ${sex} from ${location}. Wanna date?`);
   console.log(`${message.author.tag} used asl command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "asl" command`);
  } 
  
  if (command === "avatar") {
	if (!message.mentions.users.size) {
		return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
	}

	const avatarList = message.mentions.users.map(user => {
		return `${user.username}'s avatar: <${user.displayAvatarURL}>`;
	});

	// send the entire array of strings as a message
	// by default, discord.js will `.join()` the array with `\n`
	message.channel.send(avatarList);
	 console.log(`${message.author.tag} used avatar command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "avatar" command`);
  }
  
  if(command === "serverinfo") {

    let bots = 0;
    let humans = 0;
    
    message.guild.members.forEach(member => {
        if(member.user.bot) {
            bots++
        } else {
            humans++
        }
    });

   const sembed = new Discord.RichEmbed()
   .setAuthor(message.guild.name, message.guild.iconURL)
   .setColor(`#4286f4`)
   .setThumbnail(message.guild.iconURL)
   .addField("Owner", message.guild.owner, true)
   .addField("Members",`${humans} (${bots} Bots)`, true)
   .addField("ID", message.guild.id, true)
   .addField("Channels", message.guild.channels.size, true)
   .addField("Roles", message.guild.roles.size, true)
   .addField("Emojis", message.guild.emojis.size, true)
   .addField("Server Region", message.guild.region, true)
   .addField("Verification level", message.guild.verificationLevel, true)
   .setFooter(message.guild.createdAt);

    message.channel.send(sembed)
	  console.log(`${message.author.tag} used serverinfo command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "serverinfo" command`);
  } 

  if(command === 'usercount') {
    let total = bot.users.size
    let inserver = message.guild.members.size
    let cEmbed = new Discord.RichEmbed()
    .setTitle('User Count')
    .addField('In This Server', inserver)
    .addField('Total Users', total)
    message.channel.send(cEmbed)
      console.log(`${message.author.tag} used usercount command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "usercount" command`);
	
  }
  
  if(command === "whois") { //Checks if messages starts with "k!whois"
        let memberToFind = message.mentions.members.first(); //Checks for a mentioned user (@eSkuzi#0001)
 
        if (!memberToFind) { //If no member is mentioned, throw this error
            return message.channel.send('You must mention a member for this command'); //Send message and stop executing code
        }
 
        let embed = new Discord.RichEmbed()
              .setAuthor(memberToFind.user.tag, memberToFind.user.avatarURL) //This will show the users tag and avatar - there was no need to stringify that text :P
            .addField('Account Created', memberToFind.user.createdAt, true) //Shows when the user was registered
            .addField('Joined this Server', message.guild.members.find('id', memberToFind.id).joinedAt, true) //Shows when the user joined the guild
            .addField('User ID', memberToFind.id, true) //Shows the user ID
            .setColor(0xffffff) //Make the embed white
            .setFooter('Searched User') //Add a footer
            .setTimestamp() //Timestamp the footer
 
 
        message.channel.send(embed);
    console.log(`${message.author.tag} used whois command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "whois" command`); 
	  
  } 
  
  if(command === "beep") {
    const m = await message.channel.send(`Gathering hot to boop....`);
     m.edit(`boop`);
	  console.log(`${message.author.tag} used beep command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "beep" command`);

  } 
  
  if(command === "invite") { 

     const exampleEmbed = new Discord.RichEmbed()
  	 .addField(`Invite Link`, `https://discordapp.com/api/oauth2/authorize?client_id=598324681325543424&permissions=930327783&scope=bot`) 
	   .setColor(``)

     message.channel.send(exampleEmbed);
	  console.log(`${message.author.tag} used invite command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "invite" command`);
  
  } 
  
  if(command === "support") { 
    const m = await message.channel.send(`Gathering Support Server`); 
	 m.edit(`join the support server here --> https://discord.io/Venus6753`); 
	  console.log(`${message.author.tag} used support command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "support" command`);
	 
  } 
  
    if(command === "help") {

    const embed = {
      "title": "Website Help Page",
      "description": "This help page will show all of the commands. Click here for more.",
      "url": "https://discordbots.org",
      "color": 73621,
      "timestamp": "2019-05-24:22:29:16.83",
      "footer": {
        "icon_url": "https://cdn.discordapp.com/avatars/598255408850927618/10c9789ea001b302c18e8607e5290967.png?size=2048",
        "text": "Happy to help! -Venus"
      },
      "author": {
        "name": "King Venus II",
        "url": "https://discordbots.org",
        "icon_url": "https://cdn.discordapp.com/avatars/598255408850927618/10c9789ea001b302c18e8607e5290967.png?size=2048"
      },
      "fields":  [
        {
          "name": "k!kick",
          "value": "k!kick @playername <reason for kick>   |   Kicks a player from the guild"
        },
        {
          "name": "k!work",
	        "value": "k!work | earn money" 
	      },
	      { 
	        "name": "k!pay",
	        "value": "k!pay @playername <amount> | pays amount of money to mentioned user"
	      },
    	  { 
          "name": "k!autowork",
          "value": "k!autowork | automatically earn money" 
	      },
	      { 
          "name": "k!end",
          "value": "k!end | ends the autowork" 
      	}, 
      	{ 
          "name": "k!remove", 
	        "value": "k!remove <@playername> <amount> | removes amount of mentioned users money"
	      },
	      {
          "name": "k!balance",
      	  "value": "k!balance | shows your balance" 
      	},
	      { 
          "name": "k!add",
	        "value": "k!add @playername <amount> | adds money to mentinoed user | devs only" 
      	},
	      { 
          "name": "k!usercount",
          "value": "k!usercount  |  Shows all the users the bot is connected to"
        },
        { 
          "name": "k!ban",
          "value": "k!ban @playername <reason for ban>    |   Bans a player from the guild"
        },
        {
          "name": "k!prune",
          "value": "k!prune <number between 5 and 1000>   |   Removes certain number of messages"
        },
        {
          "name": "k!support",
          "value": "k!support   |   Gives link to the support server"
        },
        {
          "name": "k!ping",
          "value": "k!ping   |   Tells you how much delay the bot has"
        },
        {
          "name": "k!mute",
          "value": "k!mute @playername <reason for mute>  |   Mutes a person from the guild"
        }, 
        { 
          "name": "k!unmute",
          "value": "k!unmute @playername   |   Unmute's someone from the guild"
        }, 
        { 
          "name": "k!botinfo",
          "value": "k!botinfo   |   Shows information about the bot"
        },
        { 
          "name": "k!servers",
          "value": "k!servers   |   Shows what servers the bot is in"
        },
        {
          "name": "k!whois",
          "value": "k!whois  |   Shows some information about the user"
        },
        {
          "name": "k!asl",
          "value": "k!asl <age> <sex> <Location>   |   Sets your ASL (Age Sex Location)"
        },
        {
          "name": "k!serverinfo",
          "value": "k!serverinfo   |   Gives information about the server"
        },
        {
          "name": "k!avatar",
          "value": "k!avatar   |   Gets your avatar image   |   k!avatar @playername   |   Gets a players avatar image"  
        },
        { 
          "name": "k!status", 
          "value": "k!status | sets the bots status"
        },
        {
          "name": "k!reset",
          "value": "k!reset | resets the bot (devs only)"
        },
        {
          "name": "k!uptime", 
          "value": "k!uptime   | Shows the uptime of the bot"
        },
        { 
          "name": "k!cointoss",
          "value": "k!cointoss | Flips heads or tails"
        }, 
        { 
          "name": "k!beep",
          "value": "k!beep   |   boop" 
        },
        {
          "name": "k!help",
          "value": "k!help   |   Sends this message" 
        },
        {
          "name": "k!invite",
          "value": "k!invite   |   Gets the bots invite link"
        },
        {
          "name": "k!say",
          "value": "k!say <insert message here>   |   Have the bot say your message"
        },
        {
          "name": "k!servers",
          "value": "k!servers   |   Shows all the servers the bot is in"
        }, 
        { 
          "name": "k!argsinfo",
          "value": "k!argsinfo   |   Shows arguments about a given message"
        }
      ]
    };
    message.channel.send("Getting your help page...", { embed });
    console.log(`${message.author.tag} used help command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "help" command`);
  }
  
  if(command === "botinfo") { 
  
     const exampleEmbed = new Discord.RichEmbed()
	.setTitle(`Made By Veภนs#6753`)
	.addField(`Amount Of Servers`, `${bot.guilds.size}`) 
	.addField(`Account Created`, `Tue, Jul 9, 2019 9:28 PM`, `true`) 
  .addField(`Users`, `${client.users.size}`)
	.addField(`User ID`, `598324681325543424`) 
	.addField(`Status:`, `Online`) 
  .setThumbnail(``)	 
	.setColor(`#0099ff`)

     message.channel.send(exampleEmbed);
      console.log(`${message.author.tag} used botinfo command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "botinfo" command`);
  } 
  
  if(command === 'argsinfo') {
	if (!args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	message.channel.send(`Command name: ${command}\nArguments: ${args}`);
   console.log(`${message.author.tag} used argsinfo command`);
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "argsinfo" command`);
  }
  
  if(command === "mute") {
    if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.reply('You don\'t have permission to do that.');
    if(!message.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) return message.reply('I don\'t have the permission to do that, give me permissions!');

    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!toMute) return message.reply("You need to write someones ID or mention someone!");

    if(toMute.id === message.author.id) return message.reply("You can\'t mute yourself!");
    if(toMute.id === bot.user.id) return message.reply("**nice try :)**");
    if(toMute.id === message.guild.owner.id) return message.reply("you can't mute the Owner of this Guild.")
    if(toMute.highestRole.position >= message.member.highestRole.position) return message.reply("You can\'t mute someone with a higher role or the same as yours!");

    let role = message.guild.roles.find(r => r.name === "Muted");
    if(!role) {
        try {
            role = message.guild.createRole({
                name: "Muted",
                color: "#000000",
                permissions: []
            });
        message.guild.channels.forEach((channel, id) => {
            channel.overwritePermissions(role, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });
        } catch(e) {
            console.log(e.stack);
        }
    }
    if(toMute.roles.has(role)) return message.reply("This user is already muted!");

    toMute.addRole(role);
    message.channel.send(`${toMute} successfully muted`).then(message => {
        message.react("✅")
    });
    console.log(`${toMute.user.tag} got muted by ${message.author.tag} in ${message.channel.name}`)
    toMute.send(`You got *muted* in the Discord server **${message.guild.name}**`)
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "mute" command`); 
  } 
  
  if(command === "unmute") {
    if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.reply('You don\'t have permission to do that.');
    if(!message.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) return message.reply('I don\'t have the permission to do that, give me permissions!');

    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!toMute) return message.reply("You need to write someones ID or memtion someone!");

    let role = message.guild.roles.find(r => r.name === "Muted");

    if(!role || !toMute.roles.has(role.id)) return message.reply("This member is not muted!");

    toMute.removeRole(role);
    message.channel.send(toMute +" successfully unmuted!").then(message => {
        message.react("✅")
    });
    console.log(`${toMute.user.tag} got unmuted by ${message.author.tag} in ${message.channel.name}`)
    toMute.send("You got *unmuted* in the Discord server **MoneyDropLoby**")
    return;
	  client.channels.get("598335234425094146").send(`${message.author.tag} Used the "unmute" command`);
  } 
  
  if(command === "cointoss") {

    var cointoss = [
        "Heads",
        "Tails"
    ]
    var randomCointoss = cointoss[Math.floor(Math.random() * cointoss.length)];

     message.channel.send("You flipped.. **" + randomCointoss + "**")
    console.log(`${message.author.tag} used cointoss command`)
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "cointoss" command`);
  } 

  if(command === "uptime") {
let totalSeconds = (bot.uptime / 1000);
let days = Math.floor(totalSeconds / 86400);
let hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
let minutes = Math.floor(totalSeconds / 60);
  let uptime = `${days} days, ${hours} hours, and ${minutes} minutes`;
   message.channel.send(uptime)
    console.log(`${message.author.tag} used uptime command`)
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "uptime" command`);
  }
  
  if(command === 'servers') {
    if(!devs.includes(message.author.id)) return message.channel.send(`You can't do that.`) 
    var format = '\n'
    let slist = bot.guilds.map(g=>`${g.name} (${g.id})`).join(format)
    let sembed = new Discord.RichEmbed()
    .setTitle('Servers')
    .setDescription(slist)
    .setAuthor(message.author.tag, message.author.avatarURL)
    .setTimestamp()
    .setColor('BLURPLE')
    
    message.channel.send({embed: sembed}) 
    message.channel.send(`Serving ${bot.guilds.size} servers`)
    console.log(`${message.author.tag} used servers command`)
    client.channels.get("598335234425094146").send(`${message.author.tag} Used the "servers" command`);
  } 
  
  if(command === "eval") {
    console.log(devs)
if(devs.includes(message.author.id)) {
      try {
        const code = args.join(" ");
        if(code.includes('process.env.token')) return message.channel.send('You can\'t reveal my token!')
        let evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        console.log();((evaled), {code:"xl"});
      }catch (err) {
        console.log(`\`ERROR\` \`\`\`xl\n${(err)}\n\`\`\``);
      }
    }
  } 
   
  if(command === 'status') { 
    bot.user.setActivity(`${args.join(' ')}`)
    message.channel.send(':white_check_mark: Successfully changed status')
  }
  
  if(command === "reset") {
    if(!devs.includes(message.author.id)) return message.channel.send(`you can\'t do that.`) 
    resetBot(message.channel);
   function resetBot(channel) {
     message.channel.send('Bot is restarting')
   bot.user.setActivity(`Restarting...`)
  message.reply(':white_check_mark: Bot has been restarted successfully!')
    .then(msg => bot.destroy())
    .then(() => client.login(process.env.token))
   }
  }
});
client.login(process.env.token); 
