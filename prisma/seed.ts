import { Prisma, PostStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data (order matters due to foreign keys)
  await prisma.event.deleteMany();
  await prisma.navbarItem.deleteMany();
  await prisma.navbarCategory.deleteMany();
  await prisma.newsPost.deleteMany();
  console.log('Cleared existing data');

  // Seed news posts
  const newsPosts: Prisma.NewsPostCreateInput[] = [
    {
      titleSv: 'Löpning med GSvett',
      titleEn: 'Running with GSvett',
      contentSv:
        'Dagens löpning blir lite speciell, då vi får sällskap av våra vänner från GSvett. Kom och visa att IT-sektionen kan springa.\n\nVad?: Löpning\nVar?: Utanför Hubben\nNär?: Idag kl 17:10\nHur?: En fot framför den andra\n\nKom ihåg: det kommer bli kul, men framförallt härligt',
      contentEn:
        "Today's run will be a bit special, as we will be joined by our friends from GSvett. Come and show that the IT section can run.\n\nWhat?: Running\nWhere?: Outside Hubben\nWhen?: Today at 17:10\nHow?: One foot in front of the other\n\nRemember: it will be fun, but above all great",
      writtenByGammaUserId: 'seed-user-1',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-03-10T09:28:00')
    },
    {
      titleSv: 'Studiefrukost',
      titleEn: 'Study Breakfast',
      contentSv:
        'Tentorna närmar sig igen, och som vanligt är det viktigt att plugga, vilket kan ta mycket tid.\nPå onsdag behöver du inte oroa dig för frukosten, snIT tar hand om det.\n\nNi är alla välkomna att titta förbi Hubben på onsdag 11/3 från 08:00 för terminens studiefrukost!',
      contentEn:
        "The exams are approaching again, and as usual it's important to study, which can take up a lot of time.\nOn Wednesday you don't need to worry about breakfast, snIT will take care of that.\n\nYou're all welcome to drop by the Hubben on Wednesday, 11/3 from 08:00 for the study breakfast of the term!",
      writtenByGammaUserId: 'seed-user-2',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-03-09T07:30:00')
    },
    {
      titleSv: 'Pedagogiska prisets middag',
      titleEn: 'Pedagogical Prize dinner',
      contentSv:
        'Det är dags för den årliga Pedagogiska prisets middag på IT-sektionen, arrangerad av snIT och sexIT.\n\nMiddagen hålls på Kalle Glader, campus Johanneberg fredagen den 27 mars kl 18:01. Biljetter kan köpas via formuläret.\n\nOm du tilldelats en plats kan biljetter köpas i Hubben, campus Johanneberg, torsdagen den 12 mars under lunchtid. Maila snit@chalmers.it om du inte kan köpa biljett vid den tiden.',
      contentEn:
        'It is time for the yearly Pedagogical Prize dinner at the Software Engineering division, hosted by snIT and sexIT.\n\nThe dinner will be held at Kalle Glader, campus Johanneberg on Friday the 27th of March at 18:01. Tickets can be purchased in the following Form.\n\nIf awarded a spot, tickets can be purchased in Hubben, campus Johanneberg, on Thursday the 12th of March during lunch time. Send an email to snit@chalmers.it if you cannot purchase a ticket at that time.',
      writtenByGammaUserId: 'seed-user-2',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-03-06T17:35:00')
    },
    {
      titleSv: 'Internationella kvinnodagen',
      titleEn: "International women's day",
      contentSv:
        'Tycker du att kvinnors rättigheter är ganska nice?\n\nDet tycker vi i EqualIT och våra vänner i P.R.I.T. också! På söndag är det internationella kvinnodagen, som vi vill fira genom att sälja goda våfflor. Intäkterna doneras till Kvinnojouren och Kvinna till Kvinna.\n\nDet kommer också finnas supercoola IT-märken med pride-tema att köpa!\n\nTL;DR\nVad? Våfflor för Internationella kvinnodagen!\nVar? Hubben\nNär? 9 mars (måndag) 12:00-13:00\nVarför? För att våfflor är goda och kvinnors rättigheter är baserat',
      contentEn:
        "Do you think women's rights are kind of nice?\n\nThat's good, because we in EqualIT and our friends in P.R.I.T also think so! This Sunday is international women's day, which we want to celebrate by selling tasty waffles. The proceeds will be donated to Kvinnojouren and Kvinna till Kvinna.\n\nThere will also be super cool IT patches with a pride theme for you to buy too!\n\nTL;DR\nWhat? Waffles for International women's day!\nWhere? Hubben\nWhen? 9th of March (on Monday) 12:00-13:00\nWhy? Because waffles are tasty and women's rights are based",
      writtenByGammaUserId: 'seed-user-3',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-03-06T11:36:00')
    },
    {
      titleSv: 'Beachvolleyboll CM',
      titleEn: 'Beachvolleyball CM',
      contentSv:
        'CM-säsongen går snabbt framåt. Nästa tisdag arrangerar TDlaget och ZIK Beach Volleyball CM beachvolleyboll-CM i Kviberg. IT ställer upp med ett (eller flera) lag, och vi behöver din hjälp.\nAnmäl dig här för att tävla för IT-sektionen, helt gratis!\n\nVad?: Beachvolleyboll CM\nVar?: Kviberg Beachcenter\nNär?: Tisdag 10 mars, 13:00-17:00\nHur?: Slå hårt\n\nKom ihåg: det kommer bli kul, men framförallt härligt',
      contentEn:
        "The CM season is rapidly progressing. Next Tuesday, TDlaget and ZIK Beach Volleyball CM are organising Beach Volleyball CM in Kviberg. IT is entering one (or more) teams, and we need your assistance.\nSign up here to compete for the IT section, and it won't cost you a thing!\n\nWhat?: Beach volleyball CM\nWhere?: Kviberg Beachcenter\nWhen?: Tuesday 10 March, 13:00-17:00\nHow?: Hit hard\n\nRemember: it will be fun, but above all, great",
      writtenByGammaUserId: 'seed-user-1',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-03-04T15:07:00')
    },
    {
      titleSv: 'Lediga tjänster på Opera',
      titleEn: 'Open positions at Opera',
      contentSv:
        'Vi letar efter motiverade personer med starkt intresse för webbutveckling, molninfrastruktur och produktstrategi att gå med i våra team.\n\nVåra tjänster stöder hundratals miljoner användare över hela världen, från Opera GX gaming-ekosystemet till vår webbläsares AI-drivna funktioner.\n\nVi ser fram emot att höra från dig!',
      contentEn:
        "We are looking for motivated people with a strong interest in web engineering, cloud infrastructure, and product strategy to join our teams.\n\nOur services support hundreds of millions of users across the globe, from the Opera GX gaming ecosystem to our browser's AI-powered features. As part of our team, you'll see what it takes to design robust infrastructure, build scalable core systems, craft engaging user interfaces, and shape product vision for a large scale user base.\n\nWe are looking forward to hearing from you!",
      writtenByGammaUserId: 'seed-user-4',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-03-04T14:17:00')
    },
    {
      titleSv: 'Chalmers Rocket League-turnering',
      titleEn: 'Chalmers Rocket League tournament',
      contentSv:
        'Hej allihopa!\n\nDen 8 mars kommer vi på LaggIT att anordna ett Rocket League CM (turnering mellan Chalmers-studenter)!\nÄr du intresserad av att delta? Anmäl dig här!\n\nDeadline för anmälan är lördag 7/3 13:59.\nMer info skickas till de som anmält sig senare samma lördag.',
      contentEn:
        'Hi everyone!\n\nOn March 8th, we at LaggIT will be hosting a Rocket League CM (tournament between Chalmers students)!\nAre you interested in participating? Then sign up here!\n\nThe deadline for registration is Saturday 7/3 13:59.\nMore information will then be sent to those who have registered, later on that same Saturday (7/3).',
      writtenByGammaUserId: 'seed-user-5',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-03-03T22:45:00')
    },
    {
      titleSv: 'Sportpub',
      titleEn: 'Sport pub',
      contentSv:
        'Imorgon öppnar frITid + kids dörrarna för frITid 25, den sista sportpuben. Mat säljs, och det råkar vara så att Frölunda spelar mot Luleå i CHL samtidigt som vi har öppet.\nDet är BYOB om du vill ta med egna drycker.\n\nVad?: Sportpub\nVar?: Hubben\nNär?: Tisdag 3/3 18:00\nVad ska man ta med: Lite pengar för mat\n\nKom ihåg: det kommer bli kul, men framförallt härligt',
      contentEn:
        "Tomorrow, frITid + kids will open its doors for frITid 25, the last sports pub. Food will be sold, and it so happens that Frölunda will be playing Luleå in the CHL at the same time we are open.\nIt's BYOB if you want to bring your own drinks.\n\nWhat?: Sports pub\nWhere?: Hubben\nWhen?: Tuesday 3/3 18:00\nWhat to bring: A little money for food\n\nRemember: it'll be fun, but above all, great",
      writtenByGammaUserId: 'seed-user-1',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-03-02T19:31:00')
    },
    {
      titleSv: 'Coppercavern Catacombs; ett DrawIT-äventyr',
      titleEn: 'Coppercavern Catacombs; a DrawIT adventure',
      contentSv:
        'Kan du höra deras rop? Viskar ditt namn i vinden...\nDet finns något där nere. Något begravt och bortglömt sedan länge.\n\nVi behöver din hjälp att ta reda på vad det är. Samla era hackor och kollegor, och möt oss i Hubben 2.2\n\nKom och utforska mysteriet med oss i DrawIT på en banbrytande middagsfest!\n\nTL;DR\nVad? Galen middagsfest\nNär? 9/3, 18:01\nVar? Hubben 2.2\nKostnad? 80kr\nHur? BYOB',
      contentEn:
        'Can you hear their call? Whispering your name on the wind...\nThere is something down there. Something buried and forgotten long ago.\n\nWe need your help to figure out what it is. Gather your pickaxes and colleagues, and meet us in Hubben 2.2\n\nCome and explore the mystery with us in DrawIT on a groundbreaking dinner party that throws away tradition!\n\nTl;dr\nWhat? Bonkers dinner party\nWhen? 9/3, 18:01\nWhere? Hubben 2.2\nCost? 80kr\nHow? BYOB',
      writtenByGammaUserId: 'seed-user-6',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-25T21:00:00')
    },
    {
      titleSv: 'Revisionsberättelse LP3',
      titleEn: 'Auditors Report SP3',
      contentSv: 'Här kommer revisionsberättelsen för LP3!\n\n//Revisorerna',
      contentEn: 'Here comes the auditors report for SP3!\n\n//The Auditors',
      writtenByGammaUserId: 'seed-user-7',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-25T13:37:00')
    },
    {
      titleSv: 'CM i Dodgeball',
      titleEn: 'CM in Dodgeball',
      contentSv:
        'Kan du ducka en skiftnyckel? Då kan du ducka en boll! Anmäl dig till ITs lag för CM i Dodgeball. MISS (Maskins Idrottssällskap) öppnar årets upplaga, och IT kommer såklart tävla, men vi behöver din hjälp.\nFyll i formuläret för att anmäla dig till ITs lag, helt gratis.\n\nVad?: CM Dodgeball\nVar?: Rosendalshallen\nNär?: 3 mars kl 9:15\nHur?: Kasta bollen\n\nKom ihåg: det kommer bli kul, men framförallt härligt',
      contentEn:
        "Can you dodge a wrench? Then you can dodge a ball and I think you should sign up for IT's team for CM in Dodgeball. MISS is opening up this year's edition, and IT will of course be competing, but we need your help.\nFill in this form to sign up for IT's team, which is completely free.\n\nWhat?: CM DodgeBall\nWhere?: Rosendalshallen\nWhen?: 3 March at 9:15 a.m.\nHow?: Throw the ball\n\nRemember: it will be fun, but above all, enjoyable.",
      writtenByGammaUserId: 'seed-user-1',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-25T11:30:00')
    },
    {
      titleSv: 'Vin - Volleyboll',
      titleEn: 'Wine - Volleyball',
      contentSv:
        'Välkomna till en kul kväll med bra sällskap, goda drycker och flygande bollar.\n\nVinvolley är inget nytt, men nu introducerar vi "fulvinvolley", ett helt nytt koncept... typ.\nVi spelar, skrattar, hejar och skålar.\n\nSom vanligt blir det BBB efteråt!\nViktigt: ingen alkohol på första våningen i kårhuset!\n\nTL;DR\nVad: Fulvinvolley\nVar: Exercishallen\nNär: 6/3 15:30\nHur: Med egen tom flaska, och/eller BYOB',
      contentEn:
        'Welcome to a fun evening with good company, good drinks and flying balls.\n\nVinvolly is nothing new, but now we are introducing "fulvinvolly", a completely new concept... kinda.\nWe play, laugh, cheer and toast.\n\nAs usual, there will be BBB afterwards!\nImportant: no alcohol on the first floor of the student union house!\n\nTL;DR\nWhat: Fulvinvolly\nWhere: Exerciseshallen\nWhen: 6/3 15:30\nHow: With your own empty bottle, and/or BYOB',
      writtenByGammaUserId: 'seed-user-8',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-24T12:59:00')
    },
    {
      titleSv: 'Självförsvarskurs',
      titleEn: 'Self defence class',
      contentSv:
        'Vill du lära dig lite om självförsvar? Välkommen att delta i en självförsvarskurs med EqualIT och frITid! Kursen hålls av en kvalificerad självförsvarsinstruktör för upp till 40 deltagare.\n\nTL;DR\nVad? Självförsvarskurs\nVar? Motionshallen\nNär? 15:30 den 27 februari\nHur? Våldsamt (skoja, oroa er inte)',
      contentEn:
        "Do you feel like learning a bit about self defence? You're welcome to participate in a self defence class with EqualIT and frITid! The class is held by a qualified self defence instructor for up to 40 participants.\n\nTL;DR\nWhat? Self defence class\nWhere? Motionshallen\nWhen? 15:30 on the 27th of February\nHow? Violently (Note: the class isn't actually violent, don't worry)",
      writtenByGammaUserId: 'seed-user-3',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-23T12:39:00')
    },
    {
      titleSv: 'Sektionsmöte - Handlingar LP3 2026',
      titleEn: 'Student Division Meeting - Documents SP3 2026',
      contentSv:
        'Kl 17:30 torsdagen den 26 februari hålls IT-sektionens sektionsmöte för LP3 i HC4. Slack-kanalen som används är #sektionsmöte.\n\nNedan finns möteshandlingar för mötet.\n\nDetta kommer främst att behandlas:\nVal till frITid, ArmIT, digIT, FlashIT, RevisIT, Date-IT\n\nGlöm inte att läsa #motioner innan mötet för att bilda din åsikt.',
      contentEn:
        "At 17:30 Thursday 26th of February, IT's division meeting for SP3 will take place in HC4. The Slack channel that will be used is #sektionsmöte.\n\nBelow are meeting documents for the meeting.\n\nThis will mainly be addressed:\nElections for frITid, ArmIT, digIT, FlashIT, RevisIT, Date-IT\n\nDon't forget to read #motioner before the meeting to form your opinion.",
      writtenByGammaUserId: 'seed-user-9',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-21T23:59:00')
    },
    {
      titleSv: 'Bastu',
      titleEn: 'Sauna',
      contentSv:
        'Gymmet används fortfarande som förråd denna vecka, så vi kan inte hålla vårt vanliga fredagsevent. Därför hoppar vi denna fredag direkt till desserten. En fredag med bara BBB – kan det bli bättre?\n\nVad?: BBB\nVar?: Bastun, Kårhuset\nNär?: Fredag 15:30\nVad ska man ta med: Badkläder & handduk, (något att dricka)\n\nKom ihåg: det kommer bli kul, men framförallt härligt',
      contentEn:
        "The gym is still being used as a storage this week, so we won't be able to hold our usual Friday event. Therefore, this Friday we will skip the starter and main course and go straight to dessert. A Friday with only BBB – could it get any better?\n\nWhat?: BBB\nWhere?: The Sauna, Kårhuset\nWhen?: Friday 15:30\nWhat to bring: Swimwear & towel, (something to drink)\n\nRemember: it will be fun, but above all great",
      writtenByGammaUserId: 'seed-user-1',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-18T23:46:00')
    },
    {
      titleSv: 'LANU',
      titleEn: 'LANU',
      contentSv:
        'Häng med hela Chalmers på lördag 28 februari i SB-Multisal för det största LAN-partyt på campus! Spelklubbar från flera sektioner går ihop för en dag och natt av brädspel, turneringar och massor av andra aktiviteter!\n\n8-bIT kommer att anordna en Wii Tanks CM, så kom och spräng lite tanks!\n\nLANU är ett strikt alkoholfritt event, men snacks och mat säljs på plats av DrawIT!',
      contentEn:
        'Join all of Chalmers on Saturday, February 28th in SB-Multisal for the largest LAN-party on campus! Game clubs from multiple student divisions are banding together for a day and night of board games, tournaments, and loads of other activities!\n\n8-bIT will be hosting a Wii Tanks CM, so come join us and explode some tanks!\n\nLANU is a strict non-alcohol event, but snacks and food will be sold on site by DrawIT!',
      writtenByGammaUserId: 'seed-user-5',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-18T16:27:00')
    },
    {
      titleSv: 'Sugen på tårta?',
      titleEn: 'Craving cake?',
      contentSv:
        'Hej alla på sektionen!\n\nStudentbarometern är ute. Vill du att Chalmers ska bli bättre? Finns det något som inte fungerar?\n\nKåren bjuder sektionen med högst svarsfrekvens på tårta! Så skynda dig och fyll i den.\n\nMailet kommer från enkat@chalmers.se. Ett SMS har också skickats.',
      contentEn:
        'Hello everyone in the section!\n\nThe student barometer is out. Do you want Chalmers to become better? Is there anything that is not working?\n\nThe union will invite the section with the highest response rate to a cake! So hurry up and fill it out.\n\nThe email comes from enkat@chalmers.se. An SMS has also been sent.',
      writtenByGammaUserId: 'seed-user-10',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-17T15:45:00')
    },
    {
      titleSv: 'Rustdag LP3',
      titleEn: 'Rustday LP-3',
      contentSv:
        'Bank Bank Bonk Bonk\n\nPå söndag är det dags för P.R.I.T. 26 första rustdag!! Vi ska fixa och dona med en massa olika saker så kom och häng med oss!!\n\nStarten är kl 9, men du kan alltid dyka upp under dagen. Vi bjuder på fantastisk linssoppa med ris och bra sällskap!!\n\nVad? Det är Rustdag!!\nVar? I Hubben 2.2\nNär? 22/2 från kl 9\nVarför? För att ta hand om vår älskade hubb <3',
      contentEn:
        "Bank Bank Bonk Bonk\n\nThis sunday it's time for P.R.I.T. 26 first rustday!! We are going to be fixing and tinkering with a lot of different things so come and hang out with us!!\n\nThe start is at 9 am, but you can always show up whenever during the day. We are going to offer some amazing lentil stew with rice and good company!!\n\nWhat? It's Rustdag!!\nWhere? In Hubben 2.2\nWhen? 22/2 from 9 am\nWhy? To take care of our beloved hubb <3",
      writtenByGammaUserId: 'seed-user-11',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-16T18:19:00')
    },
    {
      titleSv: 'Kom och ät Kärleksmums med FikIT',
      titleEn: 'Come and eat Kärleksmums (Love Nomnoms?) with FikIT',
      contentSv:
        'Wow! Redan alla hjärtans dag?? Imorgon, fredag den 13:e är den perfekta dagen att komma till Hubben på lunchen för en underbar Kärleksmums! Ta med en vän, valentine eller valfri IT-teknolog! Vi ses där!\n\nVar: Hubben 2.2\nNär: 13/2 12:00\nHur: Kärleksfullt',
      contentEn:
        "Wow! Already Valentine's Day?? Tomorrow, Friday the 13th is the perfect day to come to Hubben at lunch to have a wonderful Kärleksmums! Bring a friend, valentine or any IT-teknolog! See you there!\n\nWhere: Hubben 2.2\nWhen: 13/2 12:00\nHow: Loving",
      writtenByGammaUserId: 'seed-user-12',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-12T18:55:00')
    },
    {
      titleSv: 'Sektionsmöte-workshop',
      titleEn: 'Student division meeting workshop',
      contentSv:
        'Har du idéer du vill ta upp på sektionsmötet? Behöver hjälp med att skriva en verksamhetsplan eller formulera en motion? På tisdag anordnar vi i styrIT en workshop där du kan diskutera dina idéer med oss och andra sektionsmedlemmar!\n\nTL;DR\nVad? Sektionsmöte-workshop\nVar? E-studion\nNär? 17 februari kl 17:31',
      contentEn:
        "Do you have ideas you'd like to bring up at the student division meeting? Need help with writing an activity plan or drafting a motion? This Tuesday we in styrIT are hosting a workshop where you can discuss your ideas with us and other section members!\n\nTL;DR\nWhat? Section meeting workshop\nWhere? E-studion\nWhen? 17th of February at 17:31",
      writtenByGammaUserId: 'seed-user-10',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-12T16:08:00')
    },
    {
      titleSv: 'Just Dance',
      titleEn: 'Just Dance',
      contentSv:
        'Återigen har vi inte tillgång till gymmet på fredag. frITid öppnar därför återigen dansgolvet och spelar Just Dance. Det blir svettigt, det blir kul, så kom med.\n\nVad?: Just Dance\nVar?: ML15\nNär?: Fredag 13/2 kl 15:30\nHur?: Groovy\nUtrustning: En så kallad smart telefon med Just Dance Now installerat\n\nKom ihåg: det kommer bli kul, men framförallt härligt',
      contentEn:
        "Once again, we don't have access to the gym on Friday. frITid will therefore once again open the dance floor and play Just Dance. It'll be sweaty, it'll be fun, so come along.\n\nWhat?: Just Dance\nWhere?: ML15\nWhen?: Friday 13/2 at 15:30\nHow?: Groovy\nEquipment: A so called smart phone with Just Dance Now installed\n\nRemember: it will be fun, but above all, great",
      writtenByGammaUserId: 'seed-user-1',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-11T22:57:00')
    },
    {
      titleSv: 'Karaoke-brunch',
      titleEn: 'Karaoke brunch',
      contentSv:
        'Vad är bättre än brunch?\n\nKaraoke-brunch med EqualIT såklart! Häng med på en supermysig avslutning på jämlikhetsveckan på söndag, med gratis (!) brunch och härlig karaoke!\n\nTL;DR\nVad? Karaoke-brunch\nVar? Hubben\nNär? 10:00 den 15 februari\nVarför? Jämlikhetsveckan!',
      contentEn:
        "What's better than brunch?\n\nWhy of course, it's karaoke brunch with EqualIT! Join us for a super cozy finish to the equality week on Sunday, with a bunch of free (!) brunch and great karaoke!\n\nTL;DR\nWhat? Karaoke brunch\nWhere? Hubben\nWhen? 10:00 on the 15th of February\nWhy? Equality week!",
      writtenByGammaUserId: 'seed-user-3',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-11T16:53:00')
    },
    {
      titleSv: 'Kod & Vin',
      titleEn: 'Kod & Vin',
      contentSv:
        'På fredag den 13 februari har vi Kod & Vin. Det här blir vårt sista Kod & Vin och därför bjuder vi på lite snacks. Det här blir också vårt sista "asp"-event, så om du inte redan "aspar" för digIT kan du komma hit.\n\nVad man gör på Kod & Vin är att koda och dricka vin eller valfri dryck. Vi gör också en gemensam pizzabeställning under kvällen.\n\nVad? Kod & Vin\nNär? 2026-02-13: 17:31 till sent\nVar? Hubben 2.2\nHur? BYOW',
      contentEn:
        'On Friday the 13th of February we have Kod & Vin. This will be our last Kod & Vin and that is why we will be providing some snacks. This will also be our last "asp" event, so if you aren\'t already "asping" for digIT, you can come here.\n\nWhat you do at Kod & Vin is code and drink wine or a beverage of your choice. We will also be placing a collective pizza order during the evening.\n\nWhat? Kod & Vin\nWhen? 2026-02-13: 17:31 to late\nWhere? Hubben 2.2\nHow? BYOW',
      writtenByGammaUserId: 'seed-user-13',
      status: PostStatus.PUBLISHED,
      createdAt: new Date('2026-02-10T13:31:00')
    }
  ];

  for (const post of newsPosts) {
    await prisma.newsPost.create({ data: post });
  }

  console.log(`Seeded ${newsPosts.length} news posts`);

  // Seed navbar categories and items
  await prisma.navbarCategory.create({
    data: {
      nameSv: 'Sektionen',
      nameEn: 'The Division',
      url: '',
      priority: 50,
      NavbarItem: {
        create: [
          { nameSv: 'Grupper', nameEn: 'Groups', url: '/groups', priority: 60 },
          {
            nameSv: 'Verksamhetsdokument',
            nameEn: 'Operational documents',
            url: '/documents',
            priority: 50
          },
          {
            nameSv: 'Styrdokument',
            nameEn: 'Regulatory documents',
            url: '/documents',
            priority: 40
          },
          {
            nameSv: 'Programledningen',
            nameEn: 'Programme Management Team',
            url: '/pages',
            priority: 30
          },
          { nameSv: 'SAMO', nameEn: 'SAMO', url: '/pages', priority: 20 },
          {
            nameSv: 'Hedersmedlemmar',
            nameEn: 'Honorary Members',
            url: '/pages',
            priority: 10
          }
        ]
      }
    }
  });

  await prisma.navbarCategory.create({
    data: {
      nameSv: 'Studenter',
      nameEn: 'Students',
      url: '',
      priority: 40,
      NavbarItem: {
        create: [
          {
            nameSv: 'Boka grupprum',
            nameEn: 'Book a group room',
            url: 'https://cloud.timeedit.net/chalmers/web/b1/',
            priority: 50
          },
          {
            nameSv: 'Studenthälsan',
            nameEn: 'Student Health',
            url: 'https://www.chalmers.se/utbildning/studentliv/studenthalsa/',
            priority: 40
          },
          {
            nameSv: 'Kurser',
            nameEn: 'Courses',
            url: 'https://www.student.chalmers.se/sp/programplan?program_id=2321',
            priority: 30
          },
          {
            nameSv: 'Schema',
            nameEn: 'Schedule',
            url: 'https://cloud.timeedit.net/chalmers/web/public/',
            priority: 20
          },
          {
            nameSv: 'Slack',
            nameEn: 'Slack',
            url: 'https://chalmers-it.slack.com',
            priority: 10
          }
        ]
      }
    }
  });

  await prisma.navbarCategory.create({
    data: {
      nameSv: 'Tjänster',
      nameEn: 'Services',
      url: '',
      priority: 30,
      NavbarItem: {
        create: [
          {
            nameSv: 'HubbIT',
            nameEn: 'HubbIT',
            url: 'https://hubbit.chalmers.it',
            priority: 70
          },
          {
            nameSv: 'Bilder',
            nameEn: 'Pictures',
            url: 'https://pic.chalmers.it',
            priority: 60
          },
          {
            nameSv: 'FindIT',
            nameEn: 'FindIT',
            url: 'https://findit.chalmers.it',
            priority: 50
          },
          {
            nameSv: 'Dokument',
            nameEn: 'Documents',
            url: '/documents',
            priority: 40
          },
          {
            nameSv: 'Wiki',
            nameEn: 'Wiki',
            url: 'https://wiki.chalmers.it',
            priority: 30
          },
          {
            nameSv: 'Merch',
            nameEn: 'Merch',
            url: 'https://merch.chalmers.it',
            priority: 20
          },
          {
            nameSv: 'Gamma',
            nameEn: 'Gamma',
            url: 'https://gamma.chalmers.it',
            priority: 10
          }
        ]
      }
    }
  });

  await prisma.navbarCategory.create({
    data: {
      nameSv: 'För Företag',
      nameEn: 'For Businesses',
      url: '',
      priority: 20,
      NavbarItem: {
        create: [
          {
            nameSv: 'ArmIT',
            nameEn: 'ArmIT',
            url: 'https://armit.chalmers.it',
            priority: 20
          },
          {
            nameSv: 'Våra Tjänster',
            nameEn: 'Our Services',
            url: '/pages',
            priority: 10
          }
        ]
      }
    }
  });

  await prisma.navbarCategory.create({
    data: {
      nameSv: 'Kontakta Oss',
      nameEn: 'Contact Us',
      url: '/about#contact',
      priority: 10
    }
  });

  console.log('Seeded navbar categories and items');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
