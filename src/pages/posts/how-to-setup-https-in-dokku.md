---
title: How to set up HTTPS in Dokku
date: 2024-07-19
description: Information about how ParkSpot services have SSL setup
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - parkspot
  - dokku

---

As mentioned [in my last](/posts/what-is-dokku/) [two posts](/posts/how-to-setup-dokku/), I used a tool called [Dokku](https://dokku.com/) to deploy an application that I maintain called [ParkSpot](https://park-spot.co/). I created this post to share my notes on setting up support for HTTPS in your Dokku services.

## A primer on the LetsEncrypt Dokku plugin

[LetsEncrypt](https://letsencrypt.org/) is a Certificate Authority that helps you create [domain-validated certificates](https://en.wikipedia.org/wiki/Domain-validated_certificate) for your website. To be able to create an domain-validated certificate for your website, you need to, well, prove that you have control over the domain.

Domain validated certificates are the most basic form of SSL certificates. But this is fine for small products with a small user-base. If it were to become a larger startup or company, then it would make sense for it to eventually migrate to [OV or EV certificates](https://pkic.org/2013/08/07/what-are-the-different-types-of-ssl-certificates/) for stronger forms of authentication.

I used a [Dokku](https://dokku.com/) plugin to generate my LetsEncrypt certificates. The [Dokku LetsEncrypt plugin](https://github.com/dokku/dokku-letsencrypt) makes it very easy for this validation to happen. It will automatically:

1. Make a JWS resource available at the `/.well-known/acme-challenge/<token>` location
2. Configure NGINX to momentarily redirect ACME requests to a separate webserver running on a different port (usually `:8888`)
3. After the ACME verification succeeds, place the generated `fullchain.pem` and `key.pem` files that can be used by Dokku.

Step no.2 is nice because you can refresh or add certificates with zero downtime. An app listening to HTTP/HTTPS traffic on your server can continue responding to non-ACME requests on its own port without ACME requests interfering.

The Dokku letsencrypt plugin also has a feature that allows one to very easily set up a daily CRON job that checks for certificates that are going to expire. If it finds any, it will auto-renew them.

## Creating one certificate for each domain/subdomain

There are three ways you can generate certificates for a domain and its subdomains:

1. Create one certificate for each domain/subdomain
2. Create a wildcard certificate
3. Create a Multi-Domain or Subject-Alternative Name (SAN) certificate

Each has its drawbacks. I opted for option no.1. So `park-spot.co`, `api.park-spot.co`, and `app.park-spot.co` each have their own certificate.

You can verify on Dokku the certs that are being used by your apps by issuing the following command at the command-line of your server: `dokku certs:report`.

## Steps to create an SSL certificate for an app running on Dokku

Suppose you have an app running on Dokku on your server and you would like to generate an SSL certificate for it.

I have Dokku setup such that whenever a run the command to add a domain to an application (`dokku domains:add <app> <domain>`), it will automatically attempt to create a certificate for that domain so that my domain has support for HTTPS.

So, in my server, theoretically, I should be able to issue that command to add a domain and have an SSL certificate for that domain.

In practice however, this fails. When Dokku tries to create the certificate it tries to hit the domain. If the domain does not resolve, the certificate will not be created. The certificate creation fails because the domain does not resolve. The domain does not resolve because I am in the process of adding the domain. The domain can't resolve if it has not yet finished being added.

Once the command to add a domain returns, it gives two outputs. It says the domain creation worked but then says the certificate creation failed with an error like this: `acme: error: 403 :: urn:ietf:params:acme:error:unauthorized`.

At this point, I re-run the command to add a domain and the certificate creation will work.
