## React Native YT Music Player Animation Clone

### Demo

https://github.com/user-attachments/assets/5ce07331-1a53-4bc6-9c5e-8af2dccc6b9e


### 📌 How to Try

#### 1️⃣ Set Up Audio Files

- For local audio files, move them to the audios folder.
- If you're using an audio URL, no additional setup is needed.

#### 2️⃣ Configure Track Data

- Prepare the data needed for rendering the player and playing tracks.

Example configuration:

```typescript
    // tracks.ts
    export const tracks = [
        {
            id: 1,
            title: "Song 1",
            artist: "Artist 1",
            artwork: "https://example-artwork/1.jpg",
            artworkThumbnail: "https://example-artwork-thumbnail/1.jpg",
            url: require("../audios/audio1.mp3"), // or "https://my-example/sample.mp3"
        },
        ...
    ];


    // playlists.ts
    import tracks from 'tracks.ts';

    export const playlists = [
        {
            id: 1,
            title: "Playlist 1",
            artwork: "https://example-artwork/1.jpg",
            tracks,
        },
        {
            id: 2,
            title: "Playlist 2",
            artwork: "https://example-artwork/2.jpg",
            tracks,
        },
        {
            id: 3,
            title: "Playlist 3",
            artwork: "https://example-artwork/3.jpg",
            tracks,
        },
        {
            id: 4,
            title: "Playlist 4",
            artwork: "https://example-artwork/4.jpg",
            tracks,
        }
    ];
```

#### 3️⃣ Build & Try

```
yarn start
```
