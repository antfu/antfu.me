---
title: OAuth 2.0 协议介绍
date: 2023-11-14T14:45:48
lang: zh-CN
type: blog
duration: 20min
description: 详解 OAuth 2.0 授权协议的基本概念、工作流程、四种授权模式以及令牌访问机制，理解第三方应用如何获取用户授权
---

[[toc]]

# OAuth2.0简介

## 背景

在传统的**客户端-服务器**认证模型中，客户端要请求访问受限的资源（受保护的资源）需要通过使用资源所有者的凭证与服务器进行认证。为了向第三方应用程序提供对受限资源的访问，资源所有者与第三方应用程序分享其凭证，这就会产生一些问题：

- 第三方应用程序需要存储资源所有者的凭证以备将来使用，通常是一个明文的密码。

- 服务器被要求支持密码认证，尽管使用密码认证存在安全缺陷。
- 第三方应用程序获得了过多的权限去访问资源所有者的受保护资源，使得资源所有者没有能力来限制访问持续时间或资源访问范围。
- 资源所有者不能撤销对单个第三方应用程序的访问权限，除非撤销对所有第三方应用程序访问权限，而且只能通过修改密码的方式去实现撤销访问授权。
- 任何第三方应用程序的破坏都会导致最终用户的密码和受该密码保护的所有数据被破坏。

## 什么是OAuth?

OAuth是一个关于授权的开放网络标准协议，简单理解就是一种授权机制。它是在客户端和资源所有者之间引入了一个授权层，用来分离两种不同的角色（客户端、资源所有者）。在资源所有者同意客户端的访问请求之后，会颁发一个访问令牌给客户端，这个访问令牌表示了一个特定的访问范围、声明周期以及其他访问属性，客户端携带令牌可以访问资源服务器托管的受保护资源。

比如，用户（**资源所有者**）可以授权打印服务（**客户端**）访问她存储在照片共享服务（**资源服务器**）的受保护的照片，而不需要与打印服务分享她的用户名和密码。 她直接与照片共享服务信任的服务器（**授权服务器**）进行认证，该服务器向打印服务发放特定的访问许可（访问令牌）。

## 关键角色

1. 资源所有者（**resource owner**）

   一个能够授予受保护资源访问权的实体。当资源所有者是一个人时，它被称为终端用户

2. 资源服务器（**resource server**）

   托管受保护资源的服务器，能够接受和响应使用访问令牌的受保护资源请求。

3. 客户端（**client**）

   代表资源所有者并经其授权发出受保护资源请求的应用程序。

4. 授权服务器（**authorization server**）

   服务器在成功认证资源所有者并获得授权后，向客户端发放访问令牌。

授权服务器可以是与资源服务器相同的服务器，也可以是一个单独的实体。一个授权服务器可以发行被多个资源服务器接受的访问令牌。

## 协议流程

[三方登录授权](https://juejin.cn/)

<!-- ![流程图](/assets/img/OAuth2.0.png) -->

**抽象协议流程**

```json
   	 +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     +--------+                               +---------------+
```

(A) 客户端向资源所有者请求授权，这个授权请求可以直接提交给资源所有者，或者最好是间接通过授权服务器作为中介。

(B)客户端收到一个授权许可，这是一个代表资源所有者授权的凭证，使用本规范中定义的四种授予类型之一或使用扩展许可类型表示。 授权许可类型取决于客户端用来请求授权的方法和授权服务器所支持的类型。

(C)客户端通过与授权服务器进行身份验证并出示授权许可来请求访问令牌。

(D)授权服务器对客户端进行认证，并验证授权许可，如果有效，则颁发访问令牌。

(E)客户端通过提交已认证的访问令牌，请求受保护的资源。资源服务验证访问令牌，如果有效，响应请求。

> [RFC6749](https://datatracker.ietf.org/doc/html/rfc6749)

## 访问令牌（accsss_toen）

访问令牌是用于访问受保护资源的凭证。它是向客户机颁发的授权的字符串，该字符串通常对客户端不透明。该令牌带有特定的范围（控制资源访问粒度）和持续时间，由资源所有者授权许可，资源服务器和授权服务器强行执行。令牌可能表示用于检索授权信息的标识符，也可能以可验证方式自包含授权信息（一个访问令牌字符串由一些数据和一个签名信息组成）。

访问令牌是一个抽象的层，里面放置着各种各样资源服务器能够理解的构造信息（例如：资源的访问范围、持续时间等等）。通过抽象，也使访问令牌的颁发不获得授权许可更受限制，同时也消除了资源服务器需要理解多种认证方法的需要。

### 特点

1. 短期，到期自动失效，用户无法自己修改。

2. 可以被数据所有者撤销，会立即失效。
3. 有权限范围（只读令牌比读写令牌更安全）。

> 令牌既可以让三方应用获取权限，同时又随时可控，不会危及系统安全。
>
> 只要知道了令牌，就能进入系统，系统一般不会再次确认身份，所以令牌必须保密，泄露令牌与泄露密码的后果是一样的。这也是令牌的有效期一般都设置很短的原因。

## 授权许可类型

![授权](http://cdn.qiniu.archerk.com.cn/%E6%97%A0%E6%A0%87%E9%A2%98-2022-07-11-2136.png)

授权许可代表资源所有者授权的一个凭据，可以用获取访问令牌，OAuth2.0定义了四种授权许可类型：授权码模式、隐性模式、客户端的验证授权模式、客户端凭证模式。以及提供了用于定义其他类型的可扩展机制。

### 授权码模式

第三方应用先申请一个授权码，然后再利用该授权码获取访问令牌。

> 授权码是通过使用授权服务器作为客户和资源所有者之间的中介获得的。客户端不直接向资源所有者请求授权，而是将资源所有者引向授权服务器，后者再将资源所有者的授权码返回给客户端。
>
> 在使用授权码将资源所有者引导回客户端之前，授权服务器对资源所有者进行身份验证并获得授权。因为资源所有者只向授权服务器进行身份验证，所以资源所有者的凭据永远不会与客户端共享。
>
> 授权代码提供了一些重要的安全优势，例如验证客户端的能力，以及将访问令牌直接传输到客户端，而无需通过资源所有者的用户代理，避免访问令牌泄露的风险。

> 适用于前后端分离的应用模式。

**流程**

```json
  	 +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)
```

（A）客户端通过重定向资源所有者的用户代理到授权服务器（注意资源服务与授权服务不是同一台服务器），并在请求中包含客户端标识符、请求的范围、本地状态、重定向URI等参数，一旦授权服务器许可或者拒绝后，就会返回到用户代理。

（B）授权服务器认证资源所有者（通过用户代理），确定资源所有者的许可，或者拒绝客户端的访问请求。

（C）假如资源所有者许可访问，根据早前在客户端认证阶段提供的重定向URI，并携带参数授权码和本地状态（早前在客户端认证阶段提供的）,重定向用户代理到客户端。

（D）通过在请求中包含授权码和重定向URI，客户端从令牌端点获取访问令牌。

（E）授权服务器验证授权码和重定向URI（和客户端认证阶段提供的重定向URI进行匹配），如果有效，携带访问令牌和刷新令牌（可选）响应返回。

#### 实现流程

**A网站提供一个链接，用户点击连接之后会跳转到（打开）B网站，目的是授权用户信息给A网站使用**

```json
https://b.com/oauth/authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=CALLBACK_URL&scope=read
```

> response*type \*\*\_code参数标识要求返回授权码*\*\*
>
> client\*id=CLIENT_ID \*\*\*客户端标识\_\*\*
>
> redirect\*uri=CALLBACK_URL \*\*\*处理完请求之后跳转的链接地址\_\*\*
>
> scope=read **_标识授权范围，read标识只读权限_**

**跳转到B网站之后，B网站会要求用户登录，然后询问是否给予A网站授权。用户如果表示同意，则就会跳转回redirect_uri参数指定的链接地址。跳转的同时，会传递一个授权码（code）**

```js
https://a.com/callback?code=AUTHORIZATION_CODE  //此处code的值即为授权服务器返回的授权码
```

**A网站收到B网站返回的授权码之后，在服务端向B网站发起获取令牌的请求。**

```json
https://b.com/oauth/token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&grant_type=authorization_code&code=AUTHORIZATION_CODE&redirect_uri=CALLBACK_URL
```

> client\*secret=CLIENT_SECRET \*\*\*客户端秘钥\_\*\*
>
> grant\*type=authorization_code \*\*\*表示通过授权的方式获取授权码\_\*\*
>
> code=AUTHORIZATION\*CODE \*\*\*授权码\_\*\*
>
> redirect\*uri=CALLBACK_URL \*\*\*令牌颁发后的跳转链接\_\*\*

**B网站接收到A网站发送的请求之后，颁发令牌。具体做法是向 `redirect_uri` 指定的网址，发送一段json数据。**

```json
{
  "access_token": "ACCESS_TOKEN",
  "token_type": "bearer",
  "expires_in": "234234",
  "refresh_token": "REFRESH_TOKEN",
  "scope": "read",
  "uid": 100001,
  "info": {...}
}
```

### 隐性模式

资源所有者授权后，并不会为客户端颁发授权码，而是直接颁发一个访问令牌。因为并没有颁发中间凭证（例如：授权码），授权许可类型是隐性的，故称之为隐性模式。

> 在隐性模式中发布访问令牌时，授权服务器不验证客户端。在某些情况下，客户端标识可以通过传递访问令牌给客户端的重定向URI来识别，访问令牌能够暴露给资源所有者和其他资源所有者访问的应用程序。
>
> 隐性模式提高了某些客户端的响应速度和效率（例如：作为浏览器应用程序实现的客户端）,因为它减少了获取访问令牌所需的往返次数。
>
> 因为是客户端直接获取访问令牌，安全性较低，所以当安全性要求很高的场景下，这种模式需要权衡，特别是当授权码模式可用的情况下。

#### 实现流程

**A网站提供一个链接，跳转到B网站，授权用户数据给A网站使用**

```js
https://b.com/oauth/authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=CALLBACK_URL&scope=read
```

> response*type=token \*\*\_token参数标识直接返回访问令牌*\*\*

**用户跳转到B网站，登录之后授权给A网站，跳转到redirect_uri参数指定的网址，并把访问令牌作为参数传递。**

```js
https://a.com/callback#token=ACCESS_TOKEN
```

> token参数为访问令牌，访问令牌是通过锚点（fragment）的方式传递，而不是查询字符串（querystring），是因为OAuth2.0允许跳转的网址是HTTP协议，可能会存在中间人攻击的风险，而浏览器跳转时，锚点不会被发送到服务器，就减少了泄露访问令牌的风险。

### 客户端的验证授权模式

也可以称之为密码式。客户端使用用户名和密码作为授权许可，来获得访问令牌。

> 因为需要提供用户名和密码，所以有很大的风险，只有当资源所有者对客户端充分信任的情况下以及其他授权模式不可用时，才会使用该模式。（比如，客户端是系统的一部分）
>
> 即使这种授权模式要求客户机直接访问资源所有者凭证，但资源所有者凭证只用于单个请求，用来获取访问令牌。
>
> 这种授权模式可以通过交换具有长期访问令牌或刷新令牌的凭据，消除客户端存储资源所有者凭证以备将来使用的需要。

#### 实现流程

**A网站要求用户提供B网站的用户名和密码。拿到之后，A网站直接向B网站请求访问令牌。**

```js
https://oauth.b.com/token?grant_type=password&username=USERNAME&password=PASSWORD&client_id=CLIENT_ID
```

> grant\*type=password \*\*\*标识授权方式使用密码的形式进行授权\_\*\*
>
> username & password **_用户登录B网站需要的用户名和密码_**

**B网站验证通过后，将访问令牌作为请求响应，返回给A。**

### 客户端凭证模式

当授权范围仅限于受客户端控制的受保护资源时，客户端凭据可以用作授权许可。通常当客户以自己的名义行事时（此时，客户端也是一个资源所有者），客户端许可会被使用。（非标准授权方式）

> 主要适用于没有前端的命令行应用，可以用最简单的方式获取访问令牌，在请求响应的JSON中返回访问令牌。

#### 实现流程

A应用在命令行向B应用发出请求。

> grant\*type=client_credentials \*\*\*标识使用凭证式授权\_\*\*

验证通过后，直接返回令牌。

**不论使用哪一种授权方式，第三方应用申请访问令牌之前，都必须在需要授权的系统备案，说明自己的身份，然后会拿到两个身份识别码：客户端ID（Client_ID）和客户端秘钥（Client Sercet）。这是为了防止访问令牌被滥用。没有经过备案的第三方引用，是获取不到访问令牌的。**

## 刷新令牌（refresh_token）

刷新令牌是用来获取访问令牌的凭据。刷新令牌由授权服务器下发给客户端。用于在当前访问令牌失效或过期时，获取新的访问令牌，或者获取权限范围相同或更窄的额外访问令牌。

授权服务器可自行决定是否发放刷新令牌。如果授权服务器发放刷新令牌，则会在发放访问令牌时包含它。

刷新令牌通常是一个字符串，表示资源所有者授予客户端的授权。该字符串通常对客户端是不透明的。

与访问令牌不同，刷新令牌仅用于授权服务器，并且永远不会发送到资源服务器。

```json
  +--------+                                           +---------------+
  |        |--(A)------- Authorization Grant --------->|               |
  |        |                                           |               |
  |        |<-(B)----------- Access Token -------------|               |
  |        |               & Refresh Token             |               |
  |        |                                           |               |
  |        |                            +----------+   |               |
  |        |--(C)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(D)- Protected Resource --| Resource |   | Authorization |
  | Client |                            |  Server  |   |     Server    |
  |        |--(E)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(F)- Invalid Token Error -|          |   |               |
  |        |                            +----------+   |               |
  |        |                                           |               |
  |        |--(G)----------- Refresh Token ----------->|               |
  |        |                                           |               |
  |        |<-(H)----------- Access Token -------------|               |
  +--------+           & Optional Refresh Token        +---------------+
```

(A) 客户端请求授权服务器的认证，并提交授权许可。

(B) 授权服务器认证客户端并验证授权许可后，颁发访问令牌和刷新令牌。

(C) 客户端向资源服务器发出受保护的资源请求，并提交访问令牌。

(D) 资源服务器验证访问令牌后，把受保护的资源响应给客户端。

(E) 步骤（C）和（D）重复，直到访问令牌过期。如果客户端知道访问令牌过期，就会跳到步骤（G）。否则，它将创建另一个受保护的资源请求。

(F) 由于访问令牌无效，资源服务器会返回一个无效的令牌错误。

(G) 客户端请求一个新的访问令牌，并提交刷新令牌。客户端身份验证要求基于客户机类型和授权服务器策略。

(H) 授权服务器认证客户端并验证刷新令牌后，如果有效，颁发一个新的访问令牌（此时，是否颁发一个新的刷新令牌是可选的）。

# Github授权登录

## 创建本地应用

本地应用：http://location:3000/

## 应用登记

[GitHub Docs](https://docs.github.com/cn/developers/apps/building-oauth-apps/creating-an-oauth-app)

![github_setting_applications](http://cdn.qiniu.archerk.com.cn/github.com_settings_applications_1943199.png)

GitHub服务器配置，生成 client ID 和 client Sercet ，这就是应用的身份识别码。配置应用主页地址，授权返回地址。

## 实现步骤

[Gihub实现授权流程](https://docs.github.com/cn/developers/apps/building-oauth-apps/authorizing-oauth-apps)

路由匹配重定向到GitHub授权地址。

```js
const axios = require('axios')
const KoaRouter = require('koa-router')
const qs = require('qs')
const { getCodeUrl, getTokenUrl, clientId, clientSecret, getUserInfo } = require('../config/index')
const router = new KoaRouter()

// 储存获取到的用户信息
const userInfo = {}

// 路由处理
router.get('/', async (ctx) => {
  await ctx.render('login')
})
router.get('/user', async (ctx) => {
  await ctx.render('user', { userInfo })
})

// 处理前端请求
router.get('/loginGitHub', async (ctx) => {
  // 获取授权码重定向页面地址
  const path = getCodeUrl
  // 重定向到获取授权页面
  ctx.redirect(path)
})
```

授权成功之后，重定向到redirect_uri。

路由匹配重定向地址，获取授权登录code，进行令牌请求。

```js
router.get('/callback/github', async ctx => {
  // 获取授权码
  const { code } = ctx.query

  // 请求访问令牌
  const resData = await axios.post(getTokenUrl, {
    client_id: clientId,
    client_secret: clientSecret,
    code
  })
	// 获取access_token
  const accessToken = qs.parse(resData.data).access_token

  ...
})
```

获取到令牌之后，通过令牌请求用户数据，最后进行页面渲染。

```js
// 获取用户信息
const userInfoData = await axios.get(getUserInfo, {
  headers: {
    Authorization: `token ${accessToken}`
  }
})

// 同步用户信息
userInfo = userInfoData.data

// 重定向到用户页面
ctx.redirect('/user')
```

## GitHub跳转相关地址

授权码获取地址

```js
url: https://github.com/login/oauth/authorize
request type: 'get'
params:
  client_id: string // 应用唯一标识
```

令牌获取地址

```js
url: https://github.com/login/oauth/access_token
request type: 'post'
params:
  client_id: string // 应用唯一标识
  client_secret: string // 用户申请的秘钥
  code: string // 授权码
```

用户信息获取

```js
url: https://api.github.com/user
request type: 'get'
headers: Authorization: access_token
```
