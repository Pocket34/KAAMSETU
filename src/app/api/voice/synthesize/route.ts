import { NextRequest, NextResponse } from 'next/server';

const OMNIVOICE_SERVICE_URL = process.env.OMNIVOICE_SERVICE_URL || 'http://127.0.0.1:8000';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${OMNIVOICE_SERVICE_URL}/api/voice/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        available: true,
        ...data,
      });
    } else {
      return NextResponse.json(
        {
          available: false,
          status: 'offline',
          message: 'OmniVoice service returned non-200 status',
        },
        { status: 503 }
      );
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        available: false,
        status: 'unreachable',
        error: errMsg,
        message: 'OmniVoice backend service is not running on port 8000. Fallback to Browser Speech & Text is active.',
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'en', has_consent = false, ref_audio_base64 } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text prompt is required.' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const backendRes = await fetch(`${OMNIVOICE_SERVICE_URL}/api/voice/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
          has_consent,
          ref_audio_base64,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!backendRes.ok) {
        const errorText = await backendRes.text();
        return NextResponse.json(
          {
            success: false,
            fallback: true,
            error: `OmniVoice service responded with status ${backendRes.status}`,
            details: errorText,
          },
          { status: 503 }
        );
      }

      const audioBuffer = await backendRes.arrayBuffer();

      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Disposition': 'inline; filename="jarvis_speech.wav"',
          'Cache-Control': 'no-cache',
        },
      });
    } catch {
      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          success: false,
          fallback: true,
          error: 'OmniVoice Python service is offline or unreachable on port 8000.',
          instructions: 'To start the OmniVoice engine: cd backend/voice && python main.py',
        },
        { status: 503 }
      );
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
