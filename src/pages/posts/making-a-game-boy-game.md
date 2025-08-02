---
title: 'Making a Game Boy game'
date: '2025-08-02'
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - gameboy
  - C

---

At the end of last year, I started a passion project that I had wanted to work on for a long time: making a Game Boy game.

I planned to start my Game Boy development journey by re-creating that classic dinosaur game that Chrome renders whenever it fails to connect to the internet.[^1]

I figured that I could spend the first week or so of my development making this game to get the basics down, and then I could move on to something more advanced, like re-creating a Super Mario Bros level.

ha...ha...no. I was dead wrong. Game Boy development was a zillion times more involved and low-level than I thought it would be. Just creating this basic, 2D, black-and-white, pixel-art dinosaur game was surprisingly challenging.

<aside class="prose border-l-4 border-slate-300 bg-slate-50 text-slate-600 italic rounded-md pl-4 py-2 my-4">
  In this article, when I say Game Boy, I'm specifically referring to the <a href="https://en.wikipedia.org/wiki/Game_Boy_Advance">Game Boy Advance (GBA)</a> because this is the specific console that I am most familiar with. But, all of this information also applies to the other consoles from the GBA line — namely the <a href="https://en.wikipedia.org/wiki/Game_Boy_Advance_SP">Advance SP</a> and the <a href="https://en.wikipedia.org/wiki/Game_Boy_Micro">Micro</a>. Most of this information applies to the consoles from the original Game Boy line, as well as the Game Boy Color.
</aside>

## Game Boy dev is hard

The Game Boy is an embedded system: hardware that runs code under tight resource constraints. Since it's an embedded system, your programs run directly on the hardware — on **bare-metal**, without an operating system. Without an OS, there's no standard C runtime or OS services to support the C standard library. In other words, say goodbye to `printf` and friends. Also say goodbye to [`gdb`](https://sourceware.org/gdb/). Your new debugging tools are a pencil, a paper, and your good intentions.[^2]

Fortunately, the Game Boy comes with two things that make development easier: an interface to talk directly to its hardware, and hardware logic to help you paint the screen, produce audio, detect input, and more.

This **hardware interface** has some rather nifty tricks up its sleeve.  For example, if you naïvely tried to wipe the screen by setting every single pixel, the CPU is so slow [that this could take up to 10 frames to finish](https://gbadev.net/tonc/bitmaps.html?highlight=bitmap#complications-of-bitmap-modes). Luckily, the hardware interface lets you paint the screen using "tiles" — a far more efficient approach that dramatically reduces time and memory usage. The Game Boy hardware will even assemble your sprites for you. So, you don't have to write meticulous logic to paint them on the screen pixel-by-pixel or tile-by-tile.

Also, the hardware interface is **memory-mapped**, meaning that from the programmer's perspective, to set background settings, display something, or play a sound, all you have to do is set a value at the right memory address, which is pretty nice and simple.

The downside is that this hardware interface is *very* low-level. While [memory-mapped I/O is more convenient port-mapped I/O](https://en.wikipedia.org/wiki/Memory-mapped_I/O_and_port-mapped_I/O#x86), you're still setting bits in registers, and that can be error-prone. If you configure something wrong, your compiler won't catch it. Instead, your sprite will refuse to render and after some back-of-the-envelope math, you'll notice a subtle bug in your chain of bitwise operations.

In fact, the hardware interface is so complex that there's sometimes disagreement among different Game Boy tutorials and emulators on how certain code will run on a Game Boy. [Some Game Boy emulators allow you to use blocks 4 and 5 for background tiles, others don't](https://gbadev.net/tonc/regbg.html#ssec-map-subtle). Apparently, [most Game Boy tutorials give straight-up incorrect information about how the affine transformation matrix works](https://gbadev.net/tonc/affine.html?#about-this-page). I've even seen contradicting behavior on my own Game Boy hardware as what is documented online.[^3]

Seem bad? Well, these are merely the basics. If you want your sprites to be able to occasionally misshape a little bit (like when getting hit), you're going to have to program matrix transformations that alter your sprites' affine parameters. You could alternatively use [a library that already has affine transformation logic](https://github.com/devkitPro/libtonc). But, nothing is for free. You might find yourself debugging code that looks like [this](https://github.com/devkitPro/libtonc/blob/ccc03fa321e56f51aed5e2ee1d6e3df3d1cbc803/src/tonc_obj_affine.c#L111):

```c
void obj_rotscale_ex(OBJ_ATTR *obj, OBJ_AFFINE *oaff, const AFF_SRC_EX *asx)
{
	int sx= asx->sx, sy= asx->sy;
	int sina= lu_sin(asx->alpha)>>4, cosa= lu_cos(asx->alpha)>>4;

	oaff->pa= sx*cosa>>8;		oaff->pb= -sx*sina>>8;
	oaff->pc= sy*sina>>8;		oaff->pd=  sy*cosa>>8;

	// sx = 1/sx, sy = 1/sy (.12f)
	sx= Div(1<<20, sx);
	if(sx != sy)
		sy= Div(1<<20, sy);
	else
		sy= sx;
	FIXED aa, ab, ac, ad;
	aa=  sx*cosa>>12;	ab= sy*sina>>12;	// .8f
	ac= -sx*sina>>12;	ad= sy*cosa>>12;	// .8f

	sx= oam_sizes[obj->attr0>>14][obj->attr1>>14][0];
	sy= oam_sizes[obj->attr0>>14][obj->attr1>>14][1];
...
```

We haven't even talked about displaying text, sound, hardware interrupts, or BIOS calls. But, I think you get the idea.

Crazier still is the fact that the [author of the tutorial I'm reading](https://gbadev.net/tonc/foreword.html#authors) apparently didn't find the GBA challenging enough. So, they decided to make a [mock-up of Mario Kart, a 3D game](https://gbadev.net/tonc/mode7ex.html) that can run on the GBA.

Now, if I've made the case that programming for the GBA is hard, consider that the GBA may be the *most friendly* Game Boy line to program for. This is because in many cases, you can write GBA games without touching assembly. In contrast, the original Game Boy and the Game Boy color require you to write assembly.[^4]

## Where I'm at

Because of the steep learning curve of learning the GBA, up until now, I've only programmed the basics of the chrome dinosaur game:

- Cacti spawn randomly in the horizon, and pressing "A" will make the dinosaur jump over them.
- The dinosaur has "hitboxes" that allow the game to accurately judge whether or not he was hit.

These are the things that I'd like to add before I can call the game done:

- Birds that the dinosaur can only avoid if he ducks.
- A background with clouds, like in the original game.
- A high score on the top-right that increments as the dinosaur progresses.
- A "GAME OVER" screen that allows the player to re-start after getting hit.

I will keep this website updated as I progress!

In the future I suspect that I will be able to iterate much faster because I now have a much better grasp on the Game Boy hardware interface. A future project will be to re-create [flappy bird](https://en.wikipedia.org/wiki/Flappy_Bird).

[^1]: If you're a chrome user and you have no idea what I'm talking about, you don't have to turn off your WiFi to find out. You can [play it at this link](chrome://dino). If you don't have Chrome, just imagine a 2D black-and-white pixel-art infinite scroller where a dinosaur (your character) runs through a desert and jumps/ducks to avoid cacti, birds, and other objects. The goal of the game is to avoid obstacles for as long as possible. The farther your dinosaur manages to run without getting hit, the higher your score.

[^2]: Okay, I'm being dramatic, modern emulators like [mGBA](https://mgba.io/) have outstandingly good debugging tools to inspect memory addresses, preview tile data, and step through frames. I don't know what I would have done without these.

[^3]: It's true. I've been following [an amazing tutorial to develop on the Game Boy Advance](https://gbadev.net/tonc/intro.html). But, I ran into an issue that isn't documented there, or to the best of my knowledge anywhere online. All the LLMs I asked were stumped (or hallucinating). In my hardware, I noticed that whenever I tried to put a color at the first index of a palette bank `p` where `p > 0`, the pixels that referenced that index would never actually display that color. They would only display the color located at the very first index of the very first palette bank (the transparency color). In essence, this seems to suggest that tutorials are wrong when they say that you have 16 usable color-indexes in each palette bank. I think you only really have 15, since the first index of each bank is reserved for transparency.

[^4]: Recent advances in Compiler technology have made it so that now you might be able to get away without touching assembly when developing for the original Game Boy or the Game Boy Color. For example, [SDCC](https://sdcc.sourceforge.net/) is a C compiler that specializes in targeting microprocessors, even strange ones like the `Sharp LR35902`, which is the one used in these consoles. But historically speaking, using assembly has been the norm.
