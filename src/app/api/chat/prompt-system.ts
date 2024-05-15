

// There will be a summary that runs regularly on all the posts and comments of a user in order which will provide
//  a quick excerpt that tell what the given user’s interests are.

// There will be post and comment summarization which will provide what is akin to a tldr at the top (or as an aside) of all posts.
//  Again this will be accomplished with the summarization api.

// There will be automatic post bumping. This will be accomplished with the prompt api by doing something along the lines 
// of “The following is a conversation: <insert post and comment thread here> What would be the next logical question to ask?” and
//  then using that result. I imagine this prompt format will need some refinement, but this will boil down to a bit of trial and error when the time comes to implement this.

// There will be a trending section which has content which is rising in popularity and receiving disproportionate attention. 
// I intend to do this in a conventional way using z-scores as I believe it will provide better results than trying to do this with a llm api.

// There will be a guided website tutorial upon joining the site for the first time with the option to skip. 
// I intend to do this by having the user click around to navigate to the different portions of the site in a series of steps. Where the user next needs to go will be highlighted on the ui, guiding the user's eye to the correct parts of the screen.


// 1. Tutorial
// Post and comment summarization


export function automaticPostBumping(){
    return `
    The following is a forum post and comment thread:
    Post:
    ${post}

    Comments:
    ${comment}


    What would be a good question to ask on this post? Ask as if you were discussing this post with a friend. Just write the question
    `
}

export function getUserSummary(){

    const posts = [post, post2]
    const comments = [comment, comment2]
    // Generate a summary of a user's interests based on their posts and comments.
    return `
    I'm writing a description of my STEM and Ethics interests based on my posts and comments. Write from the 1st person perspective.

    Posts:
    ${posts.join('\n')}
    Comments:
    ${comments.join('\n')}

    Description:
    `
}

export function postSummarization(){
    return `
    Generate a summary of a post.
    
    Post:
    ${post}
    `
}

export function multiplePostsSummarization(){
    const posts = [post, post2,post3]
    return `
    Generate a general summary using the posts below. Don't write 3 separate summaries, just one summary that encompasses all the posts.

    Posts:
    ${posts.join('\n')}

    Summary:
    `
}

const post3 = `
Title: Bio-Artificial Intelligence - The Synergy of Biology and Technology

Bio-Artificial Intelligence (Bio-AI) is an emerging field that aims to combine biological systems with advanced computational techniques, unlocking new possibilities for enhancing human capabilities and addressing critical challenges. By integrating the strengths of both biological and artificial intelligence, Bio-AI could revolutionize various aspects of our lives, from healthcare to environmental sustainability.

Bio-AI has the potential to offer personalized medicine, optimize agricultural practices, and enable sustainable energy production. However, this innovative field also raises ethical and societal concerns, such as the potential for bioterrorism, unforeseen ecological consequences, and the exacerbation of existing inequalities. As we venture into this new frontier, we must foster responsible development and ensure that Bio-AI serves the greater good while minimizing potential risks.
`

const post2 = `
Title: Neuralink - A Leap in Human Evolution or Cause for Concern?

Neuralink, Elon Musk's groundbreaking brain-computer interface project, offers potential benefits such as improved communication, enhanced cognitive abilities, and revolutionary treatments for neurological disorders. However, this cutting-edge technology also raises ethical concerns, including privacy and security risks, unequal access, and challenges to human identity.

As we explore the potential implications of Neuralink for human evolution, we must consider both the exciting possibilities and the inherent risks. The technology could lead to an evolutionary leap, fundamentally transforming human interaction, but could also result in dependence on technology, weakening our innate cognitive abilities. It's crucial to develop Neuralink responsibly and equitably, balancing benefits and risks as we shape our species' future.
`

const post = `
Title: The Intersection of Neuroscience and Artificial Intelligence
Hey everyone,

I'm fascinated by the intersection of neuroscience and artificial intelligence, and I wanted to start a discussion about it. Both fields have made incredible advancements in recent years, and it's interesting to think about how they can work together to further our understanding of the brain and create new AI technologies.

One area where these fields intersect is in the development of neural networks for machine learning. These networks are modeled after the structure of the brain, and they have been incredibly successful in recognizing patterns and making predictions in a variety of applications. However, there is still much we don't understand about how these networks work and how they could be improved.

Neuroscience could provide valuable insights into how the brain processes information and learns from experience. By studying the brain at a cellular and molecular level, we could gain a better understanding of the mechanisms that underlie neural network activity. This knowledge could then be applied to improve the design of artificial neural networks and create more efficient and powerful AI systems.

On the flip side, AI could also be used to help us understand the brain. For example, machine learning algorithms could be used to analyze large-scale brain imaging data and identify patterns and relationships that are not immediately apparent to human researchers. This could lead to new discoveries about brain function and could ultimately help us develop better treatments for neurological disorders.

What do you all think about this intersection between neuroscience and AI? Do you think there are other areas where these fields could work together? Let's start a discussion!
`

const comment = `
Great post! I completely agree that the intersection of neuroscience and AI has incredible potential. One area that I think could benefit from this collaboration is the development of brain-computer interfaces (BCIs). BCIs have the potential to revolutionize the way we interact with technology and could provide new ways to treat neurological disorders. By leveraging AI to analyze brain signals and improve the accuracy and speed of BCIs, we could create a whole new world of possibilities for both healthy individuals and those with disabilities. I'm excited to see where this field goes in the coming years!
`

const comment2 = `
I'm quite excited about the potential of Neuralink, especially for treating neurological disorders. However, the privacy and security concerns definitely need to be addressed. I hope that developers prioritize these issues as they continue to advance the technology.
`
const comment3 = `
I'm worried about the unequal access to this technology. It seems like Neuralink could easily create a world where only the rich have enhanced cognitive abilities, leaving the rest of us behind. We must make sure that everyone has a fair opportunity to benefit from such advancements.
`

const post3Comment1 = `
The potential of Bio-AI for sustainable energy production and agriculture is fascinating. As our world faces increasing environmental challenges, it's encouraging to see cutting-edge research that could help us overcome these obstacles and create a more sustainable future.
`

const post3Comment2 = `
While the prospects of Bio-AI are intriguing, I'm concerned about the unforeseen ecological consequences that might arise from tampering with biological systems. We must tread carefully and thoroughly assess the long-term impacts before deploying Bio-AI on a large scale.
`