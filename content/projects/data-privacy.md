---
title: 'Data Privacy - A Close Call'
date: 2023-10-14T10:42:04-07:00
description: 'A post about the importance of data privacy, and my near miss.'
tags: ['data', 'privacy', 'homelab', 'networking']
showPageTitle: true
---
I want to post about an experience that I’m currently going through with @Apple support, and use it a a platform to talk about data privacy. This is NOT the typical big tech hate post. I work for a big tech company myself, @Qualcomm, with whom I have been very happy these last few years.

Above all, security-wise, I believe that Apple is doing many things right.

A week and a half ago, my Apple ID was disabled. That day, I called Apple support, they put in a request, and they kept their word by getting back to me within 24 hours and re-activating my account. Excellent support and response time, I was very pleased with how things went.

Less than a day later, it was disabled again. Again, called support, and they put in a request, which I was supposed to hear back from within 24 hours. No response. I’ve called a total of 4 times since being disabled again, and each time, I hear nothing back, positive or negative.

Since my Apple ID has been disabled, I can’t sign out of my phone. The solution that I am facing: provide proof-of-purchase of my iPhone, the IMEI, and a new Apple ID to tether my phone to. I bought this phone through the Apple Store App, on my Apple ID, with my Apple Card. I am extremely fortunate that I have an email receipt, but if I used iCloud’s email service, this could be a very different situation.

This re-tethering process will wipe my phone. If I was not more conscious about my data, I’d be facing the very real possibility of losing all of my photos, contacts, texts, emails, and everything else potentially tied to my Apple ID.

This is not a total failure on Apple’s part – I believe I’ve just fallen into an unfortunate limbo. As I’ve been talking to Apple support (respectfully, I should add), I’ve been connected to people who were very understanding of the situation, and have done everything that they can to help. Apple does a very good job about protecting user data, so there are some rock-solid walls that prevent any unauthorized user (and me) from regaining access to my account. If anybody from Apple is reading this, I am very eager to get this situation resolved.

In light of this, I’d like to advertise a few services that I use myself (which I am not sponsored by). These services prevented me from losing everything. For the average person, the best solution is to use Proton. They provide encrypted email, calendars, contacts, file storage, and much more, all for a very reasonable price.

Personally, I host everything. This is not reasonable for most people, but I find that it keeps me sharp, and is a nice technical hobby. By nature, things break, and so I am constantly upgrading, fixing, and polishing. For the crazy privacy-focused, here is what I do:

For everything related to online documents, contacts, tasks, calendars, and most “all-in-one” cloud services that most people take for granted, I host an instance of @Nextcloud (https://github.com/nextcloud) at my home. Nextcloud is an open-source, privacy-focused cloud service that anybody with a bit of technical inclination can host themselves. For those who don’t want to go through the headache that is self-hosting, Nextcloud provides a paid service using their servers, which I can highly recommend.

Email is a bit trickier – anybody who has tried to host their own email in the past decade knows exactly what I mean. Gmail is, by far, the dominant email provider, and so they have an undeniable influence on email security. If you’re not careful, or don’t know what you’re doing, your IP will be blacklisted by larger email providers, rendering your server useless. Email is inherently complicated, antiquated, and insecure. To give you an idea, email headers, addresses, and destinations can all be spoofed very easily - it’s very much like changing the address on an envelope.

Setting up a Mail Transfer Agent (postfix), Mail Delivery Agent (dovecot), Spam and Virus Filtering (clamav), User Authentication, etc. in the right way is a very error-prone process. On top of that, once you have a working email server, you still need correct SPF, DKIM, and DMARC DNS records. These records prevent your envelopes from being modified successfully, and to prove to these larger email providers that you are not spam.

All of this being said, it is very rewarding once set up. The above is not meant to scare you away from hosting your own email, but more of a warning to let you know what you’re getting into. I personally use https://github.com/docker-mailserver/docker-mailserver, which is a stellar project that bundles every email-related program needed into a very convenient Docker image. With some background knowledge and simple configuration, you can set up an entire email server with one command.

For most people, this is far too complicated for something as simple as email, and I understand that. One very nice alternative is @ProtonMail, which is an email service focused on privacy, security, and ease-of-use. Their servers are hosted in Switzerland, which is more of a buzzword nowadays, but still provides much better security than other providers. I personally used their service for years, and if email ever gets to be too much of a headache, I will gladly return to them.

The backbone of everything that I host is @Porkbun, who is my domain registrar. I have owned my domain, chriscohen.dev, since 2019. Since 2021, Porkbun has been my registrar of choice. Their support is very responsive, helpful, and knowledgable. Their service is also very reasonably priced – I pay about $11 per year for my domain. I’ve had absolutely zero issues with them since I joined, and will be a lifelong client of theirs.

Thanks for reading, and I hope that this post can bring some awareness to those who are not conscious about where their data lives.
