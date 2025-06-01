import React, { useEffect, useRef, useState } from 'react';
import './VideoGallery.css'; // We'll create this CSS file next

const SCROLL_SPEED = 0.5; // Adjust for faster/slower scroll

const VideoGallery = ({ videos: initialVideos = [] }) => {
  const scrollerRef = useRef(null);
  const animationFrameId = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Duplicate videos for seamless looping. Ensure unique keys for duplicated items.
  const loopedVideos = initialVideos.length > 0 
    ? [
        ...initialVideos.map(v => ({ ...v, uniqueId: `original-${v.id}` })),
        ...initialVideos.map(v => ({ ...v, uniqueId: `duplicate-${v.id}` }))
      ]
    : [];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || loopedVideos.length === 0 || isHovering) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    let scrollAmount = scroller.scrollLeft;

    const animateScroll = () => {
      scrollAmount += SCROLL_SPEED;
      // Calculate the point where the first set of videos ends
      // scrollWidth is the total width of all content, including the duplicated part.
      // clientWidth is the visible width of the scroller.
      // scrollWidth / 2 represents the width of one set of videos.
      if (scrollAmount >= scroller.scrollWidth / 2) {
        scrollAmount = 0; // Reset to the beginning for seamless loop
      }
      scroller.scrollLeft = scrollAmount;
      animationFrameId.current = requestAnimationFrame(animateScroll);
    };

    animationFrameId.current = requestAnimationFrame(animateScroll);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [loopedVideos, isHovering]); // Rerun effect if videos change or hover state changes

  if (initialVideos.length === 0) {
    return <p className="no-videos-message">No learning videos available for this topic yet.</p>;
  }

  return (
    <div 
      className="video-gallery-container"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* The <h2>Featured Videos</h2> can be part of the page or this component */}
      {/* If it's part of this component, ensure it's styled or remove if redundant */}
      <div className="video-scroller" ref={scrollerRef}>
        {loopedVideos.map(video => (
          // Use video.uniqueId for the key because ids will be duplicated
          <div key={video.uniqueId} className="video-card">
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <div className="play-icon">▶</div>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                {video.description && <p>{video.description}</p>}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery; 