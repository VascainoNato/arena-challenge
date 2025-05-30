## Challenge Arena - Product Hunt

This project consists of the Arena challenge, for the Frontend position, where the proposed challenge was to make a mobile version of Product Hunt, where we must hit the official API and bring the most voted and new posts, and handle this data in the UI.

Instructions: https://www.notion.so/arenateam/Front-end-code-challenge-1ff57fa6f69e80078a90f89995fcc574

The project was built with:
- React;
- TailwindCSS;
- Zustand;
- ContextApi;
- Axios.
- Jest - UI unit tests.
- Vite - PWA.

In addition to all the features requested in the challenge, we also included:
- Production environment - Vercel;
- Zustand for global control and updating of upvotes - Synchronized with the production API;
- PWA with Vite - Working on all devices;
- TTL with Zustand - Cache that persists for up to 03 minutes, to avoid unnecessary queries in the API;
- Mobile-first on all devices;
- Dark/Light mode with ContextAPI;
- Compressed images with AVIF extension and Lazy rendering;
- Animated skeleton for rendering more posts;
- CSR in GraphQL, for code organization;
- Insertion of hooks, services and reducers to improve organization;
- Organized and standardized commits with Conventional Commit.
- A video was recorded explaining the project, why the libs were used and possible improvements.

## Important links

- Production: https://arena-challenge.vercel.app/
- Explanatory video: https://youtu.be/MuGKkL6F5hg - PT-BR.

## How to run the project locally

1. Clone the repository
git clone https://github.com/your-user/arena-challenge.git

2. Access the project directory
cd arena-challenge

3. Install the dependencies
npm install

4. Run the development environment
npm run dev

The application will be available at:
http://localhost:5173

## Author
- Developed by Rafael Satyro;
- Email: satyrorafa@gmail.com
- Linkedin: https://www.linkedin.com/in/rafael-pereira-satyro/
- Github: https://github.com/VascainoNato

## License

This project was developed exclusively for educational purposes and as part of the **Arena.im** selection process.

It has no commercial purpose and should not be reused as a final product in production by third parties.
