I have created a brand new astro project without any content. The project should be a website for my band with only static content. 

The page structure is like this:
/
/news
/about
/noise
/visual
/pit
/interlace
/impressum
/void

On / is a Haiku whichs paragraphs are from right to left and vertical (letters under each other, not tilted by 90 degrees). The haiku is on the right side of the page.
It reads "nothing but the void", "the psychedelic mayhem", "from the woods we come".
Other Content from Homepage comes from lbw-data/home.json. It is a list of cards. Each card has a title, a text and a (image) link.

On /news is headline "news from the void" and a text underneath "updates from the shack, freshly delivered to your interLace TP system for home, office or mobile"
News are paginated, 10 news per page. News content is in lbw-data/news.json. Each news has a title, a text and a date. The news are displayed in a list. The news itself are not on a separate page, The news are very short, only a card.

On /about the headline is "from the woods we come". The text underneath is "a four-piece psychedelic doom noise band, dancing on the razor's edge between technological advancements and beer. every piece we play is a result of our individual beings forming a temporary whole.". Under this text are the cards again with the data from lbw-data/about.json.

On /noise the headline is "our footprint" and the text underneath is "all of our releases can be found here. download them or listen to them for free". Followed by two cards which are linked to the albums. The data for the cards comes from lbw-data/noise.json.

On /visual the headline is "enjoy the psychedelic mayhem in pictures". Then comes an image gallery (paginated). Images data is found in lbw-data/visual.json. The images are displayed in a grid, 3 images per row. The images are clickable and open images in full screen. For all fullsscreen images it is important, that the image is closeable via browser back.

On /pit the headline is "raw noise from the pit" and the text underneath is "here we will randomly publish unedited rehearsal recordings".
Followed by an image and a list of autio files underneath. The data for the audio files comes from lbw-data/pit.json.

ON /interlace the headline is "feel free to contact us". Then followed by a text "we read all of our mails and will answer every single one. except offers for galvanized wire mesh. please stop sending us offers for galvanized wire mesh. we don't need galvanized wire mesh. thank you.". And last is a link "interlace: liquidbarbedwire@gmail.com".

On /impressum there is only the content from lbw-data/impressum.json.

It is important that on navigation the current page is highlighted.
Navigation also has a link to our bandcamp page https://liquidbarbedwire.bandcamp.com

Last but not least the page /void is our 404 page. The text is "you have reached the void. there is nothing here but you" and another text is "go back to the shack, where it is warm and safe", where "back to the shack" is linked to / (root).