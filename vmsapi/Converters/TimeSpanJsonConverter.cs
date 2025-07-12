using System.Text.Json;
using System.Text.Json.Serialization;

namespace vmsapi.Converters
{
    public class TimeSpanJsonConverter : JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = reader.GetString();
            if (string.IsNullOrEmpty(value))
                return TimeSpan.Zero;

            if (TimeSpan.TryParse(value, out var timeSpan))
                return timeSpan;

            throw new JsonException($"Unable to parse '{value}' as TimeSpan. Expected format: 'hh:mm:ss' or 'd.hh:mm:ss'");
        }

        public override void Write(Utf8JsonWriter writer, TimeSpan value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString());
        }
    }
}
