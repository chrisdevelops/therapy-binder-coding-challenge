# Therapy Session Notes

A web application for managing therapy session notes with Supabase backend integration.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_THERAPIST_ID=00000000-0000-0000-0000-000000000001
   ```

3. Set up the database tables and RLS policies in your Supabase project. NOTE: I did not have enough time to go back and add in the RLS policies in my demo. I did have some initial policies but I couldn't get them to work and shifted to focus on getting the app working before coming back. 

4. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase Project URL

**Project URL:** `https://zjtbiniyirtqdeufcbij.supabase.co`

## Assumptions

1. The first assumption for me is to have a users table (which I listed as therapist) that would have one user and I would hardcode that user in the requests to simulate have users + auth. I know the spec said no auth but I wasn't sure how to approach RLS without having at least one user to generate the policy around. In the end I disabled RLS but this was the assumption.

2. Use default styling for Material UI and keep the layout as simple as possible. I am familiar with utilizing component libraries but unfamilar with Material UI and it's various components so I needed to keep it simple and rely on AI to assist with the layout. 

3. Only going to test the happy path requirements based on the specifications. I did go a little past that by testing saving notes in the future and refactored the form component to prevent this. That was because it bothered me to ship it knowingly having that in there and it was a simple fix. 

4. I decided to use Cursor for my IDE and AI assisted developer. I have experience in variety of IDEs and environments and currenty primarily use Claude Code but I have read that many businesses and startups that are adopting AI development in the workplace seem to be favouring Cursor.

5. I set up MCP servers for Material UI, Supabase, Context7, and Chrome Devtools. That Material UI was a game changed for this challenge, especially with my lack of familiarity with this component library, although the document tool call is very large on this MCP (34k tokens). 

6. My process with AI assisted development is to get a dirty working version in fast via AI and then manually inspect and refactor. My reasoning for this approach is three-fold:

  A. We reduce the time it takes to get a working prototype up and running
  B. We want to correct any misconceptions or poor instructions the AI is adhering to early and prevent AI from reinforcing bad habits
  C. I am able to correct mistakes and set positive examples for AI to follow when continuing to iterate on select aspects of the app/feature in conjunction with AI

7. When I start new projects or features with AI I will always perform the following

  - Scaffold the project and dependencies myself as best I can before starting. I don't trust AI to install dependencies accurately so I will opt to do this myself as the AI might install a specific version which makes installing additional depencies later on difficult or debugging issues with conflicts difficult. 
  
  - Initialize Git myself and handle the feature branch creation and commits manually. I think AI can probably start handling this, especially if you scope it to just the feature branch and I am experimenting with this in Claude Code using Claude Code skills to create feature branches and commits but currently I still do this myself for accuracy and insurance. 

  - Generate a specs file at the beginning, even for smaller projects. Even if it is just to handle reinforcing the project structure, naming conventions, and code standards.
