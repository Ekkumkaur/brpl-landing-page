import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Using local backend for dev, ideally this comes from env
// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://brpl.net/api";

export const TrackingHandler = () => {
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        const track = async () => {
            // 1. Generate or retrieve Tracking ID
            let trackingId = localStorage.getItem('brpl_tracking_id');
            if (!trackingId) {
                if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                    trackingId = crypto.randomUUID();
                } else {
                    // Fallback for older browsers
                    trackingId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                localStorage.setItem('brpl_tracking_id', trackingId);
            }

            // 2. Capture URL Params
            const ref = searchParams.get('ref');
            const fbclid = searchParams.get('fbclid') || searchParams.get('fb_clid'); // handle common typo/alternative

            if (ref) {
                localStorage.setItem('brpl_ref_code', ref);
                toast({
                    title: "Referral Applied",
                    description: `Referral code ${ref} has been applied!`,
                    duration: 5000,
                });
            }
            if (fbclid) localStorage.setItem('brpl_fbclid', fbclid);

            // 3. Send to Backend
            try {
                const payload = {
                    trackingId,
                    referralCode: ref || undefined,
                    fbclid: fbclid || undefined
                };

                // Fire and forget tracking request
                await fetch(`${BASE_URL}/auth/track-visit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (e) {
                console.error("Tracking error", e);
            }
        };

        track();
    }, [searchParams]);

    return null;
};
