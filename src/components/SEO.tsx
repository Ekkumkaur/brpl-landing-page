import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
    image?: string;
    url?: string;
}

const SEO = ({
    title = 'BRPL - Beyond Reach Premier League',
    description = 'Register for the Beyond Reach Premier League (BRPL) today. Fill out the player registration form and take your cricket talent to the next level.',
    name = 'BRPL',
    type = 'website',
    image = '/logo.png',
    url = 'https://cricket.brpl.net/'
}: SEOProps) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta property='og:type' content={type} />
            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:site_name' content={name} />
            <meta property='og:url' content={url} />
            <meta property='og:image' content={image} />

            {/* Twitter tags */}
            <meta name='twitter:creator' content={name} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={title} />
            <meta name='twitter:description' content={description} />
            <meta name='twitter:image' content={image} />
        </Helmet>
    );
};

export default SEO;
