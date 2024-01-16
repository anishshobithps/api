# api.anishshobithps.com
An api for my personal stuff, which is used by [anishshobithps.com](https://anishshobithps.com)

## Prerequisites
- Node.js
- Git

## Tech Stack
* TypeScript
* Hono.js

## Setting up and Running
> [!IMPORTANT]
> To avoid confusions, I suggest creating one common directory for the API code and website code, then we can clone both project to the that common directory.

1. Create the common directory, skip if you already made the common directory while cloning the [website](https://github.com/anishshobithps/anishshobithps.com).
```sh
mkdir website
```

2. Change the directory to the `website` directory, skip if you have done during the website process.
```sh
cd website
```

3. Clone the Project
```sh
git clone git@github.com:anishshobithps/api.anishshobithps.com.git api
```

3. Change the directory to the `api` folder.
```sh
cd api
```

4. Install Dependencies required for the project.
```sh
npm install
```

5. Run the dev version or build code for production via `npm run`.
```sh
npm run dev
# or
npm run build
```
6. Start the website, in a another terminal.
