import { XMLParser } from "fast-xml-parser"

type ParsedRSS = {
  rss?: {
    channel?: {
      title?: string;
      link?: string;
      description?: string;
      item?: ParsedItem[];
    };
  };
};

type ParsedChannel = {
    title?: string;
    link?: string;
    description?: string;
    item?: ParsedItem[]
 };


type ParsedItem = {
    title?: string;
    link?: string;
    description?: string;
    pubDate?: string;
}

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  let response = await fetch(feedURL, {
    method: "GET",
    headers: {
        "User-Agent": "gator"
        }

})
let xmlString = await response.text()
const parser = new XMLParser()
const parsedXML: any = parser.parse(xmlString) as ParsedRSS;
const channel = parsedXML.rss?.channel as ParsedChannel | undefined; 

if (!channel) throw new Error("channel field not found");
const feedMetadata: RSSFeed = extractMetadata(channel)

if (Array.isArray(channel.item)) {
        const item = channel.item.map(item => extractRSSItem(item)).filter((x): x is RSSItem => x !== null);
        feedMetadata.channel.item = item
} else if (channel.item) {
    const itemArray = []
    itemArray.push(extractRSSItem(channel.item))
    const nullFreeArray = itemArray.filter((x): x is RSSItem => x !== null)
    feedMetadata.channel.item = nullFreeArray
}else {
    feedMetadata.channel.item = []
}
return feedMetadata
}

function extractMetadata(channel: ParsedChannel ): RSSFeed {
    if (!channel.title || !channel.link || !channel.description) {
        throw new Error("invalid channel metadata");
    } 
    let cleanFeed: RSSFeed = {
         channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item:[]
  }
}
    return cleanFeed
}


function extractRSSItem(channelItem: ParsedItem ): RSSItem | null {
    if (!channelItem.title || !channelItem.link || !channelItem.description || !channelItem.pubDate ) {
        return null; 
    }
    let cleanObject: RSSItem = {
         title: channelItem.title, 
         link: channelItem.link,
         description: channelItem.description,
         pubDate: channelItem.pubDate
    }
    
    return cleanObject
};
