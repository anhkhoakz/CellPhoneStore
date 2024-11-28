import React from "react";

const Page403 = () => {
    const styles = {
        container: {
            minHeight: '90vh',
            background: '#fff',
            fontFamily: "'Arvo', serif",
        },
        imageContainer: {
            backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
            height: '450px',
            backgroundPosition: 'center',
            backgroundSize: 'cover',  // ensure the image covers the area
        },
        header: {
            fontSize: '80px',
        },
        link: {
            color: '#fff',
            padding: '10px 20px',
            backgroundColor: '#39ac31',
            margin: '20px 0',
            display: 'inline-block',
            textDecoration: 'none',
        },
        contentBox: {
            marginTop: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <section className="page_403" style={{ height: '100%' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="col-sm-12 col-sm-offset-1 text-center">
                                <div style={styles.imageContainer}>
                                    <h1 style={styles.header}>403 Forbidden</h1>
                                </div>
                                <div style={styles.contentBox}>
                                    <h3 className="h2">Looks like you're lost</h3>
                                    <p>The page you are looking for is not available!</p>
                                    <a href="/" style={styles.link}>Go to Home</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Page403;
