import { useEffect } from 'react';
import FeaturedSection from './components/FeaturedSection';
import { useMusicStore } from '../../stores/useMusicStore';

const HomePage = () => {
    const { fetchSongs } = useMusicStore();

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    return (
        <div>
            <FeaturedSection />
        </div>
    );
}

export default HomePage;
